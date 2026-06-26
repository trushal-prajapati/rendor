package com.renderskin.clinic.dto;

public class ClinicMetricsResponse {
    private long activePatientsOnline;
    private long availableDoctorsCount;
    private long appointmentsBookedToday;
    private long totalPatients;
    private long pendingAppointments;
    private long consultationLoadPercent;

    public long getActivePatientsOnline() { return activePatientsOnline; }
    public void setActivePatientsOnline(long activePatientsOnline) { this.activePatientsOnline = activePatientsOnline; }
    public long getAvailableDoctorsCount() { return availableDoctorsCount; }
    public void setAvailableDoctorsCount(long availableDoctorsCount) { this.availableDoctorsCount = availableDoctorsCount; }
    public long getAppointmentsBookedToday() { return appointmentsBookedToday; }
    public void setAppointmentsBookedToday(long appointmentsBookedToday) { this.appointmentsBookedToday = appointmentsBookedToday; }
    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }
    public long getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(long pendingAppointments) { this.pendingAppointments = pendingAppointments; }
    public long getConsultationLoadPercent() { return consultationLoadPercent; }
    public void setConsultationLoadPercent(long consultationLoadPercent) { this.consultationLoadPercent = consultationLoadPercent; }
}
