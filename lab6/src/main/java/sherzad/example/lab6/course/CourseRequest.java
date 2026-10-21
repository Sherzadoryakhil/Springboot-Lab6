package sherzad.example.lab6.course;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** JSON received from the React edit form. The id stays in the URL, not the body. */
public record CourseRequest(
        @NotBlank(message = "Course code is required") String code,
        @NotBlank(message = "Course title is required") String title,
        @NotNull(message = "Credits are required") @Min(value = 1, message = "Credits must be at least 1") Integer credits
) {
}
