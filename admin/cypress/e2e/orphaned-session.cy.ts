describe("Orphaned session (cookie exists, session deleted from DB)", () => {
  const email = "alisamadi0583@gmail.com";
  const password = "rezaali83@";

  function login() {
    cy.visit("/login");
    cy.get('input[placeholder="example@example.com"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  }

  it("should clear cookies and show login page when session is deleted", () => {
    login();

    // Delete the session from the database
    cy.task("deleteUserSessions", email);

    // Visit login — proxy should detect invalid session, clear cookies, let us through
    cy.visit("/login");
    cy.url({ timeout: 10000 }).should("include", "/login");
    cy.get('button[type="submit"]').should("contain.text", "Login");

    // Verify the session cookies were cleared
    cy.getCookie("better-auth.session_token").should("be.null");
    cy.getCookie("__Secure-better-auth.session_token").should("be.null");
  });

  it("should clear cookies and show signup page when session is deleted", () => {
    login();

    cy.task("deleteUserSessions", email);

    cy.visit("/signup");
    cy.url({ timeout: 10000 }).should("include", "/signup");
    cy.get('button[type="submit"]').should("contain.text", "Sign up");

    cy.getCookie("better-auth.session_token").should("be.null");
    cy.getCookie("__Secure-better-auth.session_token").should("be.null");
  });

  it("should clear cookies and show reset-password page when session is deleted", () => {
    login();

    cy.task("deleteUserSessions", email);

    cy.visit("/reset-password");
    cy.url({ timeout: 10000 }).should("include", "/reset-password");
    cy.get('button[type="submit"]').should("contain.text", "Reset Password");

    cy.getCookie("better-auth.session_token").should("be.null");
    cy.getCookie("__Secure-better-auth.session_token").should("be.null");
  });

  it("should allow re-login after orphaned session is cleared", () => {
    login();

    cy.task("deleteUserSessions", email);

    // Visit login — cookies get cleared
    cy.visit("/login");
    cy.url({ timeout: 10000 }).should("include", "/login");

    // Log in again — should work
    cy.get('input[placeholder="example@example.com"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  });
});
