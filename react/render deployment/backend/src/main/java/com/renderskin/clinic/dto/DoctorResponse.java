package com.renderskin.clinic.dto;

public class DoctorResponse {
    private Long id;
    private Long userId;
    private String name;
    private String specialty;
    private String rating;
    private String imageUrl;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
