package ro.utcluj.cti.dynamic_delivery_system.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendForwardController {

    @GetMapping(value = {
            "/",
            "/{path:^(?!api$)(?!api/)[^\\.]*}",
            "/{path:^(?!api$)(?!api/)[^\\.]*}/**/{nestedPath:[^\\.]*}"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}