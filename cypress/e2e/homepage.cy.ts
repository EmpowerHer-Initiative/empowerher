describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should render the hero section with h1 and Get Started button", () => {
    cy.get("#hero").should("be.visible");
    cy.get("#hero h1").should("contain.text", "Build something extraordinary today");
    cy.get("#hero").contains("a", "Get Started").should("have.attr", "href", "/#pricing");
  });

  it("should render the features section", () => {
    cy.get("#features").should("exist");
  });

  it("should render the pricing section with billing toggle", () => {
    cy.get("#pricing").should("exist");
    cy.get("#pricing").contains("button", "Monthly billing").should("exist");
    cy.get("#pricing").contains("button", "Annual billing").should("exist");
  });

  it("should toggle billing between monthly and annual", () => {
    cy.get("#pricing").contains("button", "Annual billing").click();
    cy.get("#pricing").contains("button", "Monthly billing").click();
    // Verify page didn't crash after toggle
    cy.get("#pricing").should("exist");
  });

  it("should render the CTA section", () => {
    cy.contains("Let's Get In Touch").should("exist");
  });

  it("should render the blog section", () => {
    cy.get("section").contains("Blog").should("exist");
  });
});
