describe("Navbar", () => {
  describe("visibility", () => {
    it("should be visible on homepage", () => {
      cy.visit("/");
      cy.get("nav").should("be.visible");
    });

    it("should be visible on /blog", () => {
      cy.visit("/blog");
      cy.get("nav").should("be.visible");
    });

    it("should be hidden on /login", () => {
      cy.visit("/login");
      cy.get("nav").should("not.exist");
    });

    it("should be hidden on /signup", () => {
      cy.visit("/signup");
      cy.get("nav").should("not.exist");
    });

    it("should be hidden on /ui", () => {
      cy.visit("/ui");
      cy.get("nav").should("not.exist");
    });
  });

  describe("unauthenticated", () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.visit("/");
    });

    it("should show Log in button when unauthenticated", () => {
      cy.get("nav").contains("Log in").should("exist");
    });
  });

  describe("authenticated", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/");
    });

    it("should show avatar linking to /settings", () => {
      cy.get("nav").find('a[href="/settings"]').should("exist");
    });
  });

  describe("navigation", () => {
    it("should navigate to /blog via Blog link", () => {
      cy.visit("/");
      cy.get("nav").contains("a", "Blog").click();
      cy.url().should("include", "/blog");
    });
  });
});
