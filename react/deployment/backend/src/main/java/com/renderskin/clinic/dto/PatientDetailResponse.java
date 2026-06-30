package com.renderskin.clinic.dto;

import java.util.List;

public class PatientDetailResponse {
    private Long id;
    private Long userId;
    private String patientCode;
    private String fullName;
    private String email;
    private String age;
    private String skinType;
    private List<String> concerns;
    private String allergies;
    private List<MedicalFileResponse> files;
    private List<AppointmentResponse> appointments;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }
    public String getSkinType() { return skinType; }
    public void setSkinType(String skinType) { this.skinType = skinType; }
    public List<String> getConcerns() { return concerns; }
    public void setConcerns(List<String> concerns) { this.concerns = concerns; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public List<MedicalFileResponse> getFiles() { return files; }
    public void setFiles(List<MedicalFileResponse> files) { this.files = files; }
    public List<AppointmentResponse> getAppointments() { return appointments; }
    public void setAppointments(List<AppointmentResponse> appointments) { this.appointments = appointments; }
}
