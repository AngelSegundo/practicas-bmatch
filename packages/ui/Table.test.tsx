import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Table from "./Table";
import { Column } from "react-table";

interface TableTestData {
  id: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
}

const dataTest: TableTestData[] = [
  {
    id: "1",
    text1: "AB Test Column 1. Row 1",
    text2: "AB Test Column 2. Row 1",
    text3: "AB Test Column 3. Row 1",
    text4: "AB Test Column 4. Row 1",
  },
  {
    id: "2",
    text1: "z Test Column 1. Row 2",
    text2: "z Test Column 2. Row 2",
    text3: "z Test Column 3. Row 2",
    text4: "z Test Column 4. Row 2",
  },
];
const headerTest: Column<TableTestData>[] = [
  {
    Header: "Header1",
    accessor: (row: any): any => ({ text1: row.text1 } as const),
    Cell: ({ value }: { value: { text1: string } }) => {
      return (
        <div className="text-sm leading-5 font-normal text-gray-900">
          {value.text1}
        </div>
      );
    },
    id: "column1",
  },
  {
    Header: "Header2",
    accessor: (row: any): any => ({ text2: row.text2 } as const),
    Cell: ({ value }: { value: { text2: string } }) => {
      return (
        <div className="text-sm leading-5 font-normal text-gray-900">
          {value.text2}{" "}
        </div>
      );
    },
    id: "column2",
  },
  {
    Header: "Header3",
    accessor: (row: any): any => ({ text3: row.text3 } as const),
    Cell: ({ value }: { value: { text3: string } }) => {
      return (
        <div className="text-sm leading-5 font-normal text-gray-900">
          {value.text3}
        </div>
      );
    },
    id: "column3",
  },
  {
    Header: "Header4",
    accessor: (row: any): any => ({ text4: row.text4 } as const),
    Cell: ({ value }: { value: { text4: string } }) => {
      return (
        <div className="text-sm leading-5 font-normal text-gray-900">
          {value.text4}
        </div>
      );
    },
    id: "column4",
  },
];

describe("Table", () => {
  test("It renders a table element", () => {
    const { container } = render(
      <Table columns={headerTest} data={dataTest} />
    );
    const table = container.querySelector("table");
    expect(table);
    expect(table?.tagName).toBe("TABLE");
  });
  test("Table contains a tbody", () => {
    const { container } = render(
      <Table columns={headerTest} data={dataTest} />
    );
    const body = container.querySelector("tbody");
    expect(body?.tagName).toBe("TBODY");
  });
  test("Table contains a thead", () => {
    const { container } = render(
      <Table columns={headerTest} data={dataTest} />
    );
    const th = container.querySelector("thead");
    expect(th?.tagName).toBe("THEAD");
  });
  test("Table contains a th", () => {
    const { container } = render(
      <Table columns={headerTest} data={dataTest} />
    );
    const th = container.querySelector("th");
    expect(th?.tagName).toBe("TH");
  });
  test("The table must renders 4 columns", () => {
    render(<Table columns={headerTest} data={dataTest} />);
    expect(screen.queryAllByRole("columnheader")).toHaveLength(4);
  });
  test("The table must renders 3 rows = 2 dataRows + 1 headerRow", () => {
    render(<Table columns={headerTest} data={dataTest} />);
    expect(screen.queryAllByRole("row")).toHaveLength(3);
  });
  test("The table must renders 8 cells (2x4)", () => {
    render(<Table columns={headerTest} data={dataTest} />);
    expect(screen.queryAllByRole("cell")).toHaveLength(8);
  });
  describe("Styles and template", () => {
    test("Style of table", () => {
      const className = "min-w-full divide-y divide-gray-300";
      render(<Table columns={[]} data={[]} />);
      const table = screen.getByRole("table");
      expect(table.className).toEqual(expect.stringContaining(className));
    });
    test("Style of thead", () => {
      const className = "bg-gray-50";
      const { container } = render(<Table columns={[]} data={[]} />);
      const header = container.querySelector("thead");
      expect(header?.tagName).toBe("THEAD");
      expect(header?.className).toEqual(expect.stringContaining(className));
    });
    test("Style of cell of header", () => {
      const className =
        "py-3.5 pl-4 pr-3 sm:pl-6 text-xs leading-4 font-medium tracking-wider uppercase text-gray-500";
      const { container } = render(
        <Table columns={headerTest} data={dataTest} />
      );
      const th = container.querySelector("TH");
      expect(th?.tagName).toBe("TH");
      expect(th?.className).toEqual(expect.stringContaining(className));
    });
    test("Style of body", () => {
      const className = "divide-y divide-gray-200 bg-white";
      const { container } = render(<Table columns={[]} data={[]} />);
      const body = container.querySelector("tbody");
      expect(body?.tagName).toBe("TBODY");
      expect(body?.className).toEqual(expect.stringContaining(className));
    });
    test("Style of cell", () => {
      const className = "whitespace-nowrap pl-4 pr-3 text-sm sm:pl-6";
      const { container } = render(
        <Table columns={headerTest} data={dataTest} />
      );
      const cell = container.querySelector("td");
      expect(cell?.tagName).toBe("TD");
      expect(cell?.className).toEqual(expect.stringContaining(className));
    });
    test("Style of cell isDense property", () => {
      const className = "whitespace-nowrap pl-4 pr-3 text-sm sm:pl-6";
      const { container } = render(
        <Table columns={headerTest} data={dataTest} isDense />
      );
      const cell = container.querySelector("td");
      expect(cell?.tagName).toBe("TD");
      expect(cell?.className).toEqual(expect.stringContaining(className));
    });
  });
  describe("Table Sort Tests", () => {
    test("The table is not sorted.", () => {
      const { container } = render(
        <Table columns={headerTest} data={dataTest} />
      );
      const span = container.querySelector("thead")?.querySelector("span");
      expect(span).toBe(null);
    });
    test("The table is sorted by first ascending column.", () => {
      const { container } = render(
        <Table columns={headerTest} data={dataTest} />
      );
      const head = screen.getByText("Header1");
      fireEvent.click(head);
      const path = container
        .querySelector("span")
        ?.querySelector("svg")
        ?.querySelector("path")?.outerHTML;
      const cell = screen.getAllByRole("cell")[0].outerHTML;
      expect(path).toEqual(
        expect.stringContaining("M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12")
      );
      expect(cell).toEqual(expect.stringContaining("AB Test Column 1. Row 1"));
    });
    test("The table is sorted by first descending column.", () => {
      const { container } = render(
        <Table columns={headerTest} data={dataTest} />
      );
      const head = screen.getByText("Header1");
      fireEvent.click(head);
      fireEvent.click(head);
      const path = container
        .querySelector("span")
        ?.querySelector("svg")
        ?.querySelector("path")?.outerHTML;
      const cell = screen.getAllByRole("cell")[0].outerHTML;
      expect(path).toEqual(
        expect.stringContaining("M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4")
      );
      expect(cell).toEqual(expect.stringContaining("z Test Column 1. Row 2"));
    });
    test("The table is sorted by second ascending column.", () => {
      const { container } = render(
        <Table columns={headerTest} data={dataTest} />
      );
      const head2 = screen.getByText("Header2");
      fireEvent.click(head2);
      const path = container
        .querySelector("span")
        ?.querySelector("svg")
        ?.querySelector("path")?.outerHTML;
      const cell = screen.getAllByRole("cell")[1].outerHTML;
      expect(path).toEqual(
        expect.stringContaining("M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12")
      );
      expect(cell).toEqual(expect.stringContaining("AB Test Column 2. Row 1"));
    });

    test("The table is sorted by fourth descending column, there is a custom cell.", () => {
      const { container } = render(
        <Table columns={headerTest} data={dataTest} />
      );
      const head4 = screen.getByText("Header4");
      fireEvent.click(head4);
      fireEvent.click(head4);
      const path = container
        .querySelector("span")
        ?.querySelector("svg")
        ?.querySelector("path")?.outerHTML;
      const cell = screen.getAllByRole("cell")[3].outerHTML;
      console.log(cell);
      expect(path).toEqual(
        expect.stringContaining("M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4")
      );
      expect(cell).toEqual(expect.stringContaining("z Test Column 4. Row 2"));
    });
  });
});
