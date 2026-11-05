package sherzad.example.lab6.course;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

class CourseControllerTest {

    private CourseController courseController;

    // Create a fresh controller before every test
    @BeforeEach
    void setUp() {
        courseController = new CourseController(new CourseService());
    }

    // Test 01: Find an existing course
    @Test
    void testFindExistingCourse() {

        ResponseEntity<Course> response =
                courseController.getCourseById(101L);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(101L, response.getBody().id());
        assertEquals("IS-401", response.getBody().code());
    }

    // Test 02: Look up a missing course
    @Test
    void testFindMissingCourse() {

        ResponseEntity<Course> response =
                courseController.getCourseById(9999L);

        assertEquals(404, response.getStatusCode().value());
        assertNull(response.getBody());
    }

    // Test 03: Create a valid course
    @Test
    void testCreateValidCourse() {

        CourseRequest input = new CourseRequest(
                "IS-404",
                "Software Testing",
                3
        );

        ResponseEntity<Object> response =
                courseController.createCourse(input);

        assertEquals(201, response.getStatusCode().value());
        assertNotNull(response.getBody());

        Course createdCourse = (Course) response.getBody();

        assertEquals("IS-404", createdCourse.code());
        assertEquals(3, createdCourse.credits());
    }

    // Test 04: Reject zero credits
    @Test
    void testRejectZeroCredits() {

        CourseRequest input = new CourseRequest(
                "IS-404",
                "Software Testing",
                0
        );

        ResponseEntity<Object> response =
                courseController.createCourse(input);

        assertEquals(400, response.getStatusCode().value());
        assertEquals(
                "Credits must be positive",
                response.getBody()
        );
    }

    // Test 05: Delete an existing course
    @Test
    void testDeleteExistingCourse() {

        ResponseEntity<Void> response =
                courseController.deleteCourse(103L);

        assertEquals(204, response.getStatusCode().value());

        ResponseEntity<Course> lookupResponse =
                courseController.getCourseById(103L);

        assertEquals(404, lookupResponse.getStatusCode().value());
        assertNull(lookupResponse.getBody());
    }
}
