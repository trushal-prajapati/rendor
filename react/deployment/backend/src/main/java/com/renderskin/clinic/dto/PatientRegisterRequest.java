package com.renderskin.clinic.dto;

import com.renderskin.clinic.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class PatientRegisterRequest {
    @NotBlank private String fullName;
    @NotBlank @Email private String email;
    @NotBlank private String password;
    @NotBlank private String age;
    @NotBlank private String skinType;
    private List<String> concerns;
    private String allergies;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }
    public String getSkinType() { return skinType; }
    public void setSkinType(String skinType) { this.skinType = skinType; }
    public List<String> getConcerns() { return concerns; }
    public void setConcerns(List<String> concerns) { this.concerns = concerns; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
}
