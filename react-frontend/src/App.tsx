import React from "react";
import { Layout, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Pie } from "@ant-design/charts";
// import GitHubButton from "react-github-btn";
import "./App.css";

import logo from "./30px.png";
import { formatNumber } from "./utils/formatNumber";

const data = [
  {
    section: "Accounts on Tnb and Project Teams ",
    amount: 2253132,
  },
  {
    section: "Completed Tasks",
    amount: 1159150,
  },
  {
    section: "Non Team Members",
    amount: 7920418,
  },

  {
    section: "Project Teams",
    amount: 3354437,
  },
  {
    section: "Tnb Teams",
    amount: 14341474,
  },
];
const total = data.reduce((acc, { amount }) => acc + amount, 0);

const chartConfig = {
  appendPadding: 1,
  data: data,
  angleField: "amount",
  colorField: "section",
  radius: 1,
  innerRadius: 0.5,
  meta: {
    amount: {
      formatter: function formatter(total: any) {
        return "".concat(formatNumber(Number(total), 2), " TNB");
      },
    },
  },

  label: {
    type: "inner",
    offset: "-50%",
    style: {
      textAlign: "center",
      fontWeight: "bold",
      shadowColor: "grey",
      shadowBlur: 10,
    },
    autoRotate: true,
    content: "{percentage}",
  },
  pieStyle: {
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
  },
  statistic: {
    title: {
      formatter: (datum: any) => (datum ? datum.section : "TNB Supply"),
      style: {
        textAlign: "center",
        fontFamily: "Tahoma ",
        whiteSpace: "pre-wrap",
        overflow: "hidden",
        fontSize: "medium",
        paddingBottom: "5px",
        textOverflow: "ellipsis",
      },
    },
    content: {
      style: {
        fontSize: "large",
        whiteSpace: "pre-wrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
  },
  interactions: [
    { type: "element-selected" },
    { type: "element-active" },
    { type: "pie-statistic-active" },
  ],
};

const tableColumn: ColumnsType<any> = [
  {
    dataIndex: "section",
    ellipsis: true,
    align: "left",

    title: "Section",
  },
  {
    dataIndex: "amount",
    ellipsis: true,
    align: "right",
    render: (amount) => formatNumber(amount, 2),
    title: "Amount (TNB)",
  },
  {
    dataIndex: "amount",
    key: "percentage",
    align: "right",
    width: "80px",
    render: (amount) => Number(((amount * 100) / total).toFixed(2)) + "%",
    title: "Percent",
  },
];

function App() {
  // const screens = Grid.useBreakpoint();
  return (
    <>
      <Layout className="App" style={{ minHeight: "100vh" }}>
        <Layout.Header
          style={{
            padding: "30px 10vw",
            boxShadow: "100px 100px 100px 100px rgba(0,0,0,1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={logo} alt="Tnb" />
              <div
                style={{
                  fontSize: "large",
                  fontWeight: "bold",
                  paddingLeft: "13px",
                  color: "#042235",
                  width: "100px",
                }}
              >
                tnb-supply
              </div>
            </div>

            {/* <GitHubButton
              href="https://github.com/tomijaga/tnb-supply-1"
              data-color-scheme="no-preference: light; light: light; dark: dark;"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star tomijaga/tnb-supply-1 on GitHub"
            >
              Star
            </GitHubButton>
            <GitHubButton
              href="https://github.com/tomijaga"
              data-color-scheme="dark"
              data-size="large"
              data-show-count="true"
              aria-label="Follow @tomijaga on GitHub"
            >
              @tomijaga
            </GitHubButton> */}
          </div>
        </Layout.Header>
        <Layout.Content
          style={{
            padding: "50px 10vw",
            height: "100%",
            background: "#f0f2f5",
            color: "black",
            boxShadow: "inset 0px 5px 10px 0px rgba(0,0,0,0.3)",
          }}
        >
          <Pie {...chartConfig} style={{ maxWidth: "1000px" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "40px",
            }}
          >
            <Table pagination={false} dataSource={data} columns={tableColumn} />
          </div>
        </Layout.Content>

        <Layout.Footer
          style={{
            padding: "20px 10vw 50px 10vw",
          }}
        >
          <h4 style={{ textAlign: "center" }}>
            {"These results may have error margins between 1%-5%."}
          </h4>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              Data File Used:
              <a href="https://github.com/thenewboston-developers/Payment-Processor/blob/master/csvs/contributors.csv">
                contributors.csv
              </a>
              <a href="https://github.com/thenewboston-developers/Payment-Processor/blob/master/csvs/tasks.csv">
                tasks.csv
              </a>
              <a href="https://github.com/thenewboston-developers/Payment-Processor/blob/master/csvs/teams.csv">
                teams.csv
              </a>
              <a href="https://github.com/thenewboston-developers/Project-Proposals/blob/master/CSVs/project-teams.csv">
                project-teams.csv
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              Results from Data:
              <a href="https://github.com/tomijaga/tnb-supply-1/blob/main/src/csvs/output/accounts-on-both-teams.csv">
                accounts-on-both-teams.csv
              </a>
              <a href="https://github.com/tomijaga/tnb-supply-1/blob/main/src/csvs/output/project-teams.csv">
                project-teams.csv
              </a>
              <a href="https://github.com/tomijaga/tnb-supply-1/blob/main/src/csvs/output/tasks.csv">
                tasks.csv
              </a>
              <a href="https://github.com/tomijaga/tnb-supply-1/blob/main/src/csvs/output/teams.csv">
                teams.csv
              </a>
              <a href="https://github.com/tomijaga/tnb-supply-1/blob/main/src/csvs/output/tnb-supply.csv">
                tnb-supply.csv
              </a>
            </div>
          </div>
        </Layout.Footer>
      </Layout>
    </>
  );
}

export default App;
