/// <reference types="Cypress" />

describe("Test-1", () => {
  it("Rendering Application", () => {
    cy.visit("./index.html");
  });
  it("Should contains 10 bombs", () => {
    cy.visit("./index.html");
    cy.get(".bomb").should("have.length", 10);
  });
  it("Should contain 90 valid Boxes", () => {
    cy.visit("./index.html");
    cy.get(".valid").should("have.length", 90);
  });
  it("On click on bomb game should be over", () => {
    cy.visit("./index.html");
    cy.get(".bomb").then((bombs) => {
      const bomb = bombs[0];
      bomb.click({ force: true });
      cy.get("#result").should("contain", "YOU LOSE!");
    });
  });
  it("On click on bomb show all the bombs", () => {
    cy.visit("./index.html");
    cy.get(".bomb").then((bombs) => {
      const bomb = bombs[0];
      bomb.click({ force: true });
      cy.get(".checked").should("have.length", 10);
    });
  });
  it("Should be able to WIN Game", () => {
    cy.visit("./index.html");
    cy.get(".valid").then((valids) => {
      for (let i = 0; i < valids.length; i++) {
        valids[i].click();
      }
    });
    cy.wait(1000);
    cy.get("#result").should("contain", "YOU WIN!");
  });
  it("Should be able WIN if Flagged all the bombs", () => {
    cy.visit("./index.html");
    cy.get(".bomb").each(($el, index, $list) => {
      cy.wrap($el).trigger("contextmenu");
    });
    cy.wait(1000);
    cy.get("#result").should("contain", "YOU WIN!");
  });
  it("'data' arribute should contain correct number of bombs in the neighborhood", () => {
    cy.visit("./index.html");
    cy.get(".valid").then((valids) => {
      const valid = valids[0];
      valid.click();
    });

    cy.document().then((document) => {
      const grid = document.querySelector(".grid");
      const squares = grid.childNodes;
      const width = 10;
      for (let i = 0; i < squares.length; i++) {
        const isLeftEdge = i % width === 0;
        const isRightEdge = i % width === width - 1;
        const isTopEdge = i < width;
        const isBottomEdge = i >= width * width - width;
        const right = !isRightEdge && squares[i + 1].classList.contains("bomb");
        const left = !isLeftEdge && squares[i - 1].classList.contains("bomb");
        const top = !isTopEdge && squares[i - width].classList.contains("bomb");
        const bottom =
          !isBottomEdge && squares[i + width].classList.contains("bomb");
        const northEast =
          !isRightEdge &&
          !isTopEdge &&
          squares[i + 1 - width].classList.contains("bomb");
        const northWest =
          !isLeftEdge &&
          !isTopEdge &&
          squares[i - 1 - width].classList.contains("bomb");
        const southEast =
          !isRightEdge &&
          !isBottomEdge &&
          squares[i + 1 + width].classList.contains("bomb");
        const southWest =
          !isLeftEdge &&
          !isBottomEdge &&
          squares[i - 1 + width].classList.contains("bomb");
        let total =
          right +
          left +
          top +
          bottom +
          northEast +
          northWest +
          southEast +
          southWest;
        expect(parseInt(squares[i].getAttribute("data"))).to.eql(
          parseInt(total)
        );
      }
    });
  });
  it("Should be able to show correct number of flags", () => {
    cy.visit("./index.html");
    cy.get(".bomb").each(($el, index, $list) => {
      cy.wrap($el).trigger("contextmenu");
      if (index % 2 == 0) cy.wrap($el).trigger("contextmenu");
    });
    cy.get("#flagsLeft").should("contain", 5);
  });
  it("Should not able to add more than 10 flags", () => {
    cy.visit("./index.html");
    let i = 0;
    cy.get(".valid").each(($el, index, $list) => {
      if (i < 11) {
        cy.wrap($el).trigger("contextmenu");
        i++;
      }
    });
    cy.get("#flagsLeft").should("contain", 0);
    cy.get(".flag").should("have.length", 10);
  });
});
