describe('The Home Page', () => {
    it('successfully loads', () => {
        cy.visit('/'); // change URL to match your dev URL

        cy.get('input[name=username]').type('admin');

        // {enter} causes the form to submit
        cy.get('input[name=password]').type(`${111111}{enter}`);
        // we should be redirected to /dashboard
        cy.url().should('include', '/dashboard');
    });
});
