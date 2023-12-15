import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent,
      fixture: ComponentFixture<CoursesCardListComponent>,
      el: DebugElement;
  // Here the component caanot be tested directly. We should use fixture and then use a method of fixture to correctly test a component.
  beforeEach(waitForAsync(()=>{
    // Here in the configuration instead of importing each of the dependency like the MatButton, MatToolBar etc, we can just import
    // the entire module. After that we compile those components using compileComponents(). This method is asychronous.
    // Hence, after that we are using a then() block. Within this then block we are going to configure the component for testing using
    // fixture and its method. That is also the reason we are wrting this within a waitForAsync() method.
    TestBed.configureTestingModule({ imports: [CoursesModule] }).compileComponents()
      .then(()=>{
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));
  it("Should create the component", () => {
    expect(component).toBeTruthy();
  });
  it("Should display the course list", () => {
    component.courses = setupCourses(); // Here instead of creating a file and exporting it we can define the data in this file itself
    fixture.detectChanges(); // We have updated the courses in this spec file. But for it to be detected
    const card = el.queryAll(By.css(".course-card")); // Here the outermost div has the CSS class course-card. So we are finding that
    // DOM element using that CSS class name. This element is being repeated using ngFor. So it will have a length.
    expect(card).toBeTruthy();
    expect(card.length).toBe(12);
  });
  it("should display the first course", () => {
    component.courses=setupCourses();
    fixture.detectChanges();
    const course= component.courses[0];
    const card = el.query(By.css(".course-card:first-child")),
          title = card.query(By.css("mat-card-title")),
          image = card.query(By.css("img"));
    expect(card).toBeTruthy();
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});


