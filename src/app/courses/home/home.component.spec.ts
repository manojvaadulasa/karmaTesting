import {waitForAsync, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';




fdescribe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(courses=> courses.category == "BEGINNER");
  const advancedCourses = setupCourses().filter(courses=> courses.category == "ADVANCED");

  beforeEach(waitForAsync(() => {
    // Important: Whenever we use compileComponents() use use waitForAsync without fail along with then() block
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", ["findAllCourses"]);
    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule // We are using animations in our app by using mat-tab. Hence, we must import this module else the angular app crashes.
      ],
      providers: [
        {provide : CoursesService , useValue: coursesServiceSpy}
      ]
    }).compileComponents()
      .then(()=>{
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService)
      });
  }));

  it("Should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("Should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    // Here the findAllCourses() method is being spyed on and the returnValue(setupCourses().filter(courses=> courses.category == "BEGINNER"))
    // is ensuring that whenever that method is used we use the data from setupCourses().
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1,"Unexpected number of tabs found");
  });


  it("Should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1,"Unexpected number of tabs found");
  });


  it("Should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(2,"Unexpected number of tabs found");
  });

  // Note :- Instead of fakeAsync we can also use waitForAsync()
  // But instead of using flush(), tick(), flushMicrotasks() etc we should use fixture.whenStable().then(()=>{write lines inside here})
  it("Should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    click(tabs[1]);
    fixture.detectChanges();
    flush();
    const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));
    expect(cardTitles.length).toBeGreaterThan(0);
  }));

  // Another method of testing the above:-
  it("Older way of testing advanced tab is clicked",(done:DoneFn)=>{
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    click(tabs[1]);
    fixture.detectChanges();
    setTimeout(()=>{
      const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));
      expect(cardTitles.length).toBeGreaterThan(0);
      done();
    },500);
  });

  //  Another method of testing the above:-
  it("Second older way of testing advanced tab is clicked",fakeAsync(()=>{
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    click(tabs[1]);
    fixture.detectChanges();
    let titlesLength : number = 0;
    setTimeout(()=>{
      const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));
      titlesLength = cardTitles.length;
    },500);
    flush(); // This is going to ensure that all the setTimeout or setInterval are implemented.
    expect(titlesLength).toBeGreaterThan(0);
  }));

  //  Another method of testing the above:-
  it("Third older way of testing advanced tab is clicked",fakeAsync(()=>{
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    click(tabs[1]);
    fixture.detectChanges();
    let titlesLength : number = 0;
    Promise.resolve().then(()=>{
      const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));
      titlesLength = cardTitles.length;
    });
    flushMicrotasks(); // This is going to ensure that Promises in the MicroTask Queue is implemented.
    expect(titlesLength).toBeGreaterThan(0);
    flush();
  }));

});


