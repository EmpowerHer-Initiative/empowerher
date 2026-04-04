describe("404 page", () => {
  beforeEach(() => {
    cy.visit("/this-route-does-not-exist-123", { failOnStatusCode: false });
  });

  it("should show 404 for unknown route", () => {
    cy.contains("Page not found").should("be.visible");
  });

  it("should have a Take me home button", () => {
    cy.contains("a", "Take me home").should("have.attr", "href", "/");
  });

  it("should have a Go back button", () => {
    cy.contains("button", "Go back").should("exist");
  });
});
