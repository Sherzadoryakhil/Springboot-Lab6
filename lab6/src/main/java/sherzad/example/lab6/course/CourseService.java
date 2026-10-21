package sherzad.example.lab6.course;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CourseService {
    private final Map<Long, Course> courses = new ConcurrentHashMap<>();

    public CourseService() {
        courses.put(101L, new Course(101L, "IS-401", "Advanced Enterprise Web Development", 3));
        courses.put(102L, new Course(102L, "CS-205", "Data Structures", 4));
        courses.put(103L, new Course(103L, "SE-310", "Software Engineering", 3));
    }

    public List<Course> findAll() {
        return courses.values().stream()
                .sorted(Comparator.comparing(Course::id))
                .toList();
    }

    public Course update(Long id, CourseRequest request) {
        if (!courses.containsKey(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course " + id + " was not found");
        }

        Course updated = new Course(id, request.code().trim(), request.title().trim(), request.credits());
        courses.put(id, updated);
        return updated;
    }

    public void delete(Long id) {
        if (courses.remove(id) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course " + id + " was not found");
        }
    }
}
