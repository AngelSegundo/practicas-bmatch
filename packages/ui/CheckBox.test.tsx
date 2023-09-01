// NOTE: Necesitaremos poder hacer tests en ui para probar el código
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Checkbox from "ui";

describe("Checkbox", () => {
  test("It renders a input type checkbox element", () => {
    const { container } = render(
      <Checkbox
        id=""
        name=""
        label=""
        value
        onChange={() => null}
        containerClassName=""
      />
    );
    const checkbox = container.querySelector("input");
    expect(checkbox);
    expect(checkbox?.tagName).toBe("INPUT");
    expect(checkbox?.type).toBe("checkbox");
  });

  test("It renders a label 'Test label'", () => {
    const label = "Test label";
    const { container } = render(
      <Checkbox
        id=""
        name=""
        label={label}
        value
        onChange={() => null}
        containerClassName=""
      />
    );
    const labelToCheck = container.querySelector("label")?.textContent;
    expect(labelToCheck).toEqual(label);
  });

  test("It calls the onChange handler when clicked", () => {
    const mockFn = jest.fn();
    const { container } = render(
      <Checkbox
        id=""
        name=""
        label=""
        value
        onChange={mockFn}
        containerClassName=""
      />
    );
    const checkbox = container.querySelector("input");
    fireEvent.click(checkbox);
    expect(mockFn.mock.calls.length).toBe(1);
  });

  describe("Styles and template", () => {
    test("Label style", () => {
      const labelClassName = "ml-2 block text-base sm:text-sm text-gray-500";
      const { container } = render(
        <Checkbox
          id=""
          name=""
          label="Test de estilo del label"
          value
          onChange={() => null}
          containerClassName=""
        />
      );
      const label = container.querySelector("label");

      expect(label?.className).toEqual(expect.stringContaining(labelClassName));
    });
  });
});
