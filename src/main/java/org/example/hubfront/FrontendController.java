package org.example.hubfront;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping("/login")
    public String login() {
        return "forward:/login/login.html";
    }

    @GetMapping("/main")
    public String mainPage() {
        return "forward:/main/main.html";
    }

    @GetMapping("/home-organization")
    public String homeOrganization() {
        return "forward:/home-organization/organization.html";
    }

    @GetMapping({"/home","/"})
    public String home() {
        return "forward:/home/home.html";
    }

    @GetMapping("/admin")
    public String admin() {
        return "forward:/admin/admin.html";
    }

    @GetMapping("/login/forgot-password")
    public String forgotPassword() {
        return "forward:/login/forgot-password.html";
    }

    @GetMapping("/login/reset-password")
    public String resetPassword() {
        return "forward:/login/reset-password.html";
    }
}