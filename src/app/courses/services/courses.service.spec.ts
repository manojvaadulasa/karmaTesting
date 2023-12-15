import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService",()=>{

  let coursesService:CoursesService,httpTestingController:HttpTestingController;
  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers:[
        CoursesService
      ]
    });
    coursesService=TestBed.inject(CoursesService);
    httpTestingController=TestBed.inject(HttpTestingController);
  });
  it("Should get all the courses",()=>{
    coursesService.findAllCourses().subscribe(courses=>{
      expect(courses).toBeTruthy("No courses here"); // It throws an error if the request doesn't return anything
      expect(courses.length).toBe(12,"Incorrect number of courses");// It throws an error if the length does not match
      const course = courses.find(course=> course.id==12);
      expect(course.titles.description).toBe("Angular Testing Course");// One of the result id is fetched and its title is checked.
    });
    const req=httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET"); // Checks whether the requested method is a http.get method.
    req.flush({payload: Object.values(COURSES)}); // Basically, clears all the requests. So we need to provide an argument stating
    // what exactly we need to be flushed.
  });
  it("Should get the course by the ID",()=>{
    coursesService.findCourseById(12).subscribe(courses=>{
      expect(courses).toBeTruthy("No courses here"); // It throws an error if the request doesn't return anything
      expect(courses.id).toBe(12); // Chekc whether the same id is fetched.
      expect(courses.titles.description).toBe("Angular Testing Course");// One of the result id is fetched and its title is checked.
    });
    const req=httpTestingController.expectOne("/api/courses/12"); // This is mock HTTP request.
    expect(req.request.method).toEqual("GET"); // Checks whether the requested method is a http.get method.
    req.flush(COURSES[12]); // Basically, clears all the requests. So we need to provide an argument stating
    // what exactly we need to be flushed.
  });
  it("Should make changes to the requested ID",()=>{
    const changes: Partial<Course> = {titles:{description:" "}};
    coursesService.saveCourse(12,changes).subscribe(course=>{
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    req.flush({
      ...COURSES[12],
      ...changes
    });// Here COURSES[12] will have a different data then the one we are checking.
    // That's why we are using the spread operator and the second argument ...changes is saying that the description part
    // should be empty.
  });
  it("Should throw an error if the HTTP request fails on saveCourses()",()=>{
    coursesService.saveCourse(12,{titles:{description:" "}}).subscribe(()=>{
      fail("Save course failed");
    }, (error:HttpErrorResponse)=>{
      expect(error.status).toBe(500);
    });
    const req=httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    req.flush("Save courses failed",{status:500,statusText:"Internal server error"});
  });
  it("Should fetch all the lessons",()=>{
    coursesService.findLessons(12).subscribe(lessons=>{
      expect(lessons).toBeTruthy("No lessons here");
      expect(lessons.length).toEqual(3);
    });
    const req=httpTestingController.expectOne(req=>req.url=="/api/lessons"); // The actual API will also contain query params.
    // Hence, the above is used. This will check the URL like a Regular Expression and check whether the above exists on the entire URL.
    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");
    req.flush({
      payload:findLessonsForCourse(12).slice(0,3)
    });
  });
  afterEach(()=>{
    httpTestingController.verify();
  });
});
