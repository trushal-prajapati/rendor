package com.renderskin.clinic.service;

import com.renderskin.clinic.dto.*;
import com.renderskin.clinic.entity.*;
import com.renderskin.clinic.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClinicService {
    private final AppointmentRepository appointmentRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final MedicalFileRepository medicalFileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ClinicService(AppointmentRepository appointmentRepository,
                         PatientProfileRepository patientProfileRepository,
                         DoctorProfileRepository doctorProfileRepository,
                         MedicalFileRepository medicalFileRepository,
                         UserRepository userRepository,
                         FileStorageService fileStorageService) {
        this.appointmentRepository = appointmentRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.medicalFileRepository = medicalFileRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<DoctorResponse> getDoctors() {
        return doctorProfileRepository.findAll().stream().map(this::toDoctorResponse).collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse bookAppointment(Long userId, BookAppointmentRequest request) {
        PatientProfile patient = patientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));
        DoctorProfile doctor = doctorProfileRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setTimeSlot(request.getTimeSlot());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return toAppointmentResponse(appointmentRepository.save(appointment));
    }

    public List<AppointmentResponse> getPatientAppointments(Long userId) {
        PatientProfile patient = patientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patient.getId())
                .stream().map(this::toAppointmentResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAllByOrderByAppointmentDateDesc()
                .stream().map(this::toAppointmentResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getDoctorAppointments(Long userId) {
        DoctorProfile doctor = doctorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found"));
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDesc(doctor.getId())
                .stream().map(this::toAppointmentResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PatientDetailResponse> getDoctorPatients(Long userId) {
        DoctorProfile doctor = doctorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found"));
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDesc(doctor.getId()).stream()
                .map(Appointment::getPatient)
                .collect(Collectors.toMap(PatientProfile::getId, p -> p, (a, b) -> a))
                .values().stream()
                .map(this::toPatientDetail)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PatientDetailResponse getPatientDetail(Long patientId) {
        PatientProfile patient = patientProfileRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        return toPatientDetail(patient);
    }

    @Transactional
    public MedicalFileResponse uploadFile(Long userId, MultipartFile file) throws Exception {
        PatientProfile patient = patientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));

        String stored = fileStorageService.store(file);
        MedicalFile medicalFile = new MedicalFile();
        medicalFile.setPatient(patient);
        medicalFile.setFileName(stored);
        medicalFile.setOriginalName(file.getOriginalFilename());
        medicalFile.setContentType(file.getContentType());
        medicalFile.setFileSize(file.getSize());
        medicalFile.setStoragePath(stored);
        return toFileResponse(medicalFileRepository.save(medicalFile));
    }

    public List<MedicalFileResponse> getPatientFiles(Long userId) {
        PatientProfile patient = patientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));
        return medicalFileRepository.findByPatientIdOrderByUploadedAtDesc(patient.getId())
                .stream().map(this::toFileResponse).collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        appointment.setStatus(status);
        return toAppointmentResponse(appointmentRepository.save(appointment));
    }

    public ClinicMetricsResponse getMetrics() {
        LocalDate today = LocalDate.now();
        ClinicMetricsResponse m = new ClinicMetricsResponse();
        m.setTotalPatients(patientProfileRepository.count());
        m.setAvailableDoctorsCount(doctorProfileRepository.count());
        m.setAppointmentsBookedToday(appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.CONFIRMED));
        m.setPendingAppointments(appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.PENDING));
        m.setActivePatientsOnline(Math.min(m.getTotalPatients(), 24));
        long total = appointmentRepository.count();
        m.setConsultationLoadPercent(total == 0 ? 0 : Math.min(100, total * 10));
        return m;
    }

    private DoctorResponse toDoctorResponse(DoctorProfile d) {
        DoctorResponse r = new DoctorResponse();
        r.setId(d.getId());
        r.setUserId(d.getUser().getId());
        r.setName(d.getUser().getFullName());
        r.setSpecialty(d.getSpecialty());
        r.setRating(d.getRating());
        r.setImageUrl(d.getImageUrl());
        return r;
    }

    private AppointmentResponse toAppointmentResponse(Appointment a) {
        AppointmentResponse r = new AppointmentResponse();
        r.setId(a.getId());
        r.setPatientId(a.getPatient().getId());
        r.setPatientName(a.getPatient().getUser().getFullName());
        r.setPatientCode(a.getPatient().getPatientCode());
        r.setPatientEmail(a.getPatient().getUser().getEmail());
        r.setDoctorId(a.getDoctor().getId());
        r.setDoctorName(a.getDoctor().getUser().getFullName());
        r.setDoctorSpecialty(a.getDoctor().getSpecialty());
        r.setAppointmentDate(a.getAppointmentDate());
        r.setTimeSlot(a.getTimeSlot());
        r.setStatus(a.getStatus());
        r.setNotes(a.getNotes());
        r.setCreatedAt(a.getCreatedAt());
        return r;
    }

    private PatientDetailResponse toPatientDetail(PatientProfile p) {
        PatientDetailResponse r = new PatientDetailResponse();
        r.setId(p.getId());
        r.setUserId(p.getUser().getId());
        r.setPatientCode(p.getPatientCode());
        r.setFullName(p.getUser().getFullName());
        r.setEmail(p.getUser().getEmail());
        r.setAge(p.getAge());
        r.setSkinType(p.getSkinType());
        r.setConcerns(p.getConcerns());
        r.setAllergies(p.getAllergies());
        r.setFiles(medicalFileRepository.findByPatientIdOrderByUploadedAtDesc(p.getId())
                .stream().map(this::toFileResponse).collect(Collectors.toList()));
        r.setAppointments(appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(p.getId())
                .stream().map(this::toAppointmentResponse).collect(Collectors.toList()));
        return r;
    }

    private MedicalFileResponse toFileResponse(MedicalFile f) {
        MedicalFileResponse r = new MedicalFileResponse();
        r.setId(f.getId());
        r.setOriginalName(f.getOriginalName());
        r.setContentType(f.getContentType());
        r.setFileSize(f.getFileSize());
        r.setDownloadUrl("/api/files/" + f.getId());
        r.setUploadedAt(f.getUploadedAt());
        return r;
    }

    public MedicalFile getFileEntity(Long id) {
        return medicalFileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));
    }
}
