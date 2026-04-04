describe("Blog", () => {
  beforeEach(() => {
    cy.visit("/blog");
  });

  it("should load the blog page with heading", () => {
    cy.get("h1").should("contain.text", "Blog");
  });

  it("should display blog cards", () => {
    cy.get(".grid a").should("have.length.greaterThan", 0);
  });

  it("should show pagination when there are more than 6 posts", () => {
    // 9 blog posts / 6 per page = 2 pages, so pagination should exist
    cy.contains("button", "2").should("exist");
  });

  it("should navigate to page 2", () => {
    cy.contains("button", "2").click();
    cy.url().should("include", "page=2");
  });

  it("should navigate to an individual blog post", () => {
    cy.get(".grid a").first().click();
    cy.url().should("match", /\/blog\/.+/);
  });

  it("should have a back button on post that returns to /blog", () => {
    cy.get(".grid a").first().click();
    cy.url().should("match", /\/blog\/.+/);
    cy.contains("Blog").click();
    cy.url().should("match", /\/blog\/?$/);
  });

  it("should show 404 for non-existent slug", () => {
    cy.request({
      url: "/blog/nonexistent-slug-xyz-12345",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("should default to page 1 for ?page=abc", () => {
    cy.visit("/blog?page=abc");
    cy.get("h1").should("contain.text", "Blog");
    cy.get(".grid a").should("have.length.greaterThan", 0);
  });

  it("should default to page 1 for ?page=0", () => {
    cy.visit("/blog?page=0");
    cy.get("h1").should("contain.text", "Blog");
    cy.get(".grid a").should("have.length.greaterThan", 0);
  });

  it("should clamp to last page for ?page=999", () => {
    cy.visit("/blog?page=999");
    cy.get("h1").should("contain.text", "Blog");
    cy.get(".grid a").should("have.length.greaterThan", 0);
  });
});
