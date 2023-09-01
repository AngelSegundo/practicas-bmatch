import { render, fireEvent, screen, getNodeText } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "./Button";

describe("Button", () => {
  test("It renders a button element", () => {
    render(<Button label="" onClick={() => {}} />);
    expect(screen.getByRole("button"));
  });

  test("It renders the label", () => {
    const label = "entrar";
    render(<Button label={label} onClick={() => {}} />);
    const button = screen.getByRole("button");
    const text = getNodeText(button);
    expect(text).toBe(label);
  });

  describe("styles and template", () => {
    test("It applies default classes", () => {
      const className = "border-gray-300 text-gray-700 bg-white";
      const hoverClassName = "hover:bg-gray-100";
      render(<Button label={""} template="default" onClick={() => {}} />);
      const button = screen.getByRole("button");
      expect(button.className).toEqual(expect.stringContaining(className));
      expect(button.className).toEqual(expect.stringContaining(hoverClassName));
    });

    test("It applies primary template", () => {
      const className = "border-transparent text-white bg-teal-600";
      const hoverClassName = "hover:bg-teal-700";
      render(<Button label={""} template="primary" onClick={() => {}} />);
      const button = screen.getByRole("button");
      expect(button.className).toEqual(expect.stringContaining(className));
      expect(button.className).toEqual(expect.stringContaining(hoverClassName));
    });

    test("It applies secondary template", () => {
      const className = "border-transparent text-teal-700 bg-teal-100";
      const hoverClassName = "hover:bg-teal-200";
      render(<Button label={""} template="secondary" onClick={() => {}} />);
      const button = screen.getByRole("button");
      expect(button.className).toEqual(expect.stringContaining(className));
      expect(button.className).toEqual(expect.stringContaining(hoverClassName));
    });
  });

  test("It calls the onClick handler when clicked", () => {
    const mockFn = jest.fn();
    render(<Button label="" onClick={mockFn} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockFn.mock.calls.length).toBe(1);
  });

  test("It renders a disabled button", () => {
    const disabled = true;
    render(<Button label={""} disabled={disabled} onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button.className).toEqual(expect.stringContaining("opacity-25"));
  });

  test.todo("It renders an icon if passed");
});
