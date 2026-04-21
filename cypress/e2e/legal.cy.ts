describe("Legal pages", () => {
  it("should load the privacy policy page", () => {
    cy.visit("/privacy");
    cy.get("article, [data-testid='mdx-content'], .prose").should("exist");
    cy.contains(/privacy/i).should("exist");
  });

  it("should load the terms of service page", () => {
    cy.visit("/terms");
    cy.get("article, [data-testid='mdx-content'], .prose").should("exist");
    cy.contains(/terms/i).should("exist");
  });

  it("should show 404 for non-existent legal page", () => {
    cy.request({
      url: "/nonexistent-legal-page",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
