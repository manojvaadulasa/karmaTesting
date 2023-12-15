describe("Home page",()=>{
  beforeEach(()=>{
    cy.fixture("courses.json").as("coursesJSON");
    cy.server();
    cy.route("/api/courses","@coursesJSON").as("courses");
    cy.visit("/");
  });
  it("Should display a list of courses",()=>{
    cy.contains("All Courses");
    cy.wait("@courses");
    cy.get("mat-card").should("have.length",9);
  });
  it("Should display advanced courses",()=>{
    cy.get('[role="tab"]').should("have.length",2);
    cy.get('[role="tab"]').last().click();
    cy.wait(500);
    cy.get('[data-mat-tab-active="true"]');
    cy.get('[data-mat-card-title="true"]').first().should("contain","Angular Security Course");
  });
});
