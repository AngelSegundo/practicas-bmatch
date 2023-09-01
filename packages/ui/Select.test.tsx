// NOTE: Necesitaremos poder hacer tests en ui para probar el código y mejorar el test "It renders options when selectOptions is provided"
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Select } from "./Select";

const selectOptions = [
  { value: "Seleccionar", id: "Seleccionar" },
  { value: "Siderurgia", id: "Siderurgia" },
];

describe("Select", () => {
  test("It renders a ul element", () => {
    const mockFn = jest.fn();
    const { container } = render(
      <Select
        id="test"
        label=""
        selectOptions={selectOptions}
        value={"Valor"}
        onChange={mockFn}
        onBlur={() => null}
        error=""
        containerClassName=""
      />
    );
    const button = container.querySelector("button");
    fireEvent.click(button);
    const ul = container.querySelector("ul");
    expect(ul?.tagName).toBe("UL");
  });

  test("It renders two li elements", () => {
    const mockFn = jest.fn();
    const { container } = render(
      <Select
        id="test"
        label=""
        selectOptions={selectOptions}
        value={"Valor"}
        onChange={mockFn}
        onBlur={() => null}
        error=""
        containerClassName=""
      />
    );
    const button = container.querySelector("button");
    fireEvent.click(button);
    const li = container.querySelector("li");
    expect(li?.tagName).toBe("LI");
    expect(li.tagName.length).toBe(2);
  });

  test("It renders a label 'Test label'", () => {
    const label = "Test label";
    const { container } = render(
      <Select
        id="test"
        label={label}
        selectOptions={[]}
        value=""
        onChange={() => null}
        onBlur={() => null}
        error=""
        containerClassName=""
      />
    );
    const labelToCheck = container.querySelector("label")?.textContent;
    expect(labelToCheck).toEqual(label);
  });

  test("It renders options when selectOptions is provided", () => {
    const { container } = render(
      <Select
        id=""
        label=""
        selectOptions={selectOptions}
        value=""
        onChange={() => null}
        onBlur={() => null}
        error=""
        containerClassName=""
      />
    );
    const select = container.querySelector("select");
    const options = select?.querySelector("option");

    expect(options);
  });

  test("It renders a <p> for error when error is provided", () => {
    const errorText = "Test error";
    const errorClassName = "text-base sm:text-sm text-red-500";
    const { container } = render(
      <Select
        id="test"
        label=""
        selectOptions={[]}
        value=""
        onChange={() => null}
        onBlur={() => null}
        error={errorText}
        containerClassName=""
      />
    );
    const errorToCheck = container.querySelector("p");
    expect(errorToCheck?.textContent).toEqual(errorText);
    expect(errorToCheck?.className).toEqual(errorClassName);
  });
});
