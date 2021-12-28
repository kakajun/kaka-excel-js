const columns = [
  {
    field: "bankname",
    title: "关联公司",
    type: "string",
    align: "left",
    fixed: true,
    width: "226px",
    automaticLine: false,
  },
  {
    field: "nc",
    title: "年初",
    type: "decimal",
    hidden: false,
    children: [
      {
        field: "A",
        title: "账面余额",
        type: "decimal",
      },
      {
        field: "B",
        title: "坏账准备",
        type: "decimal",
      }
    ],
  },
  {
    field: "bqljzj",
    title: "本期累计增加",
    type: "decimal",
    hidden: false,
    children: [
      {
        field: "C",
        title: "账面余额",
        type: "decimal",
      },
      {
        field: "D",
        title: "坏账准备",
        type: "decimal",
      },
    ],
  },
  {
    field: "bqljjs",
    title: "本期累计减少",
    type: "decimal",
    hidden: false,
    children: [
      {
        field: "E",
        title: "账面余额",
        type: "decimal",
      },
      {
        field: "F",
        title: "坏账准备",
        type: "decimal",
      },
    ],
  },
  {
    field: "qm",
    title: "期末",
    type: "decimal",
    hidden: false,
    children: [
      {
        field: "G",
        title: "账面余额",
        type: "decimal",
      },
      {
        field: "H",
        title: "坏账准备",
        type: "decimal",
      },
    ],
  },
  {
    field: "I",
    title: "账面余额占比",
    type: "decimal",
    unit: "%",
    align: "right",
    fixed: false,
    automaticLine: false,
  },
];

const datas = [
  {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "一级公司",
    rn: 2,
  },
  {
    A: 423030.99,
    B: 0,
    C: 4552556.79,
    D: 0,
    E: 4552556.79,
    F: 0,
    G: 423030.99,
    H: 0,
    I: 0.03,
    bankname: "XX有限公司",
    rn: 3,
  },
  {
    A: 0,
    B: 0,
    C: 13880271.85,
    D: 0,
    E: 12157291.42,
    F: 0,
    G: -1722980.43,
    H: 0,
    I: -0.1,
    bankname: "XX有限公司",
    rn: 4,
  },
  {
    A: 16837.1,
    B: 0,
    C: 31982027.42,
    D: 0,
    E: 32468541.6,
    F: 0,
    G: 503351.28,
    H: 0,
    I: 0.03,
    bankname: "XX有限公司",
    rn: 5,
  },
  {
    A: -26099.6,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: -26099.6,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 6,
  },
  {
    A: 0,
    B: 0,
    C: 989992.2,
    D: 0,
    E: 1752799.97,
    F: 0,
    G: 762807.77,
    H: 0,
    I: 0.05,
    bankname: "XX有限公司",
    rn: 7,
  },
  {
    A: -227799.74,
    B: 0,
    C: 67758.98,
    D: 0,
    E: 335522.85,
    F: 0,
    G: 39964.13,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 8,
  },
  {
    A: 10078839.99,
    B: 0,
    C: 35629879.89,
    D: 0,
    E: 23711428.11,
    F: 0,
    G: -1839611.79,
    H: 0,
    I: -0.11,
    bankname: "XX有限公司",
    rn: 9,
  },
  {
    A: 0,
    B: 0,
    C: 19537126.37,
    D: 0,
    E: 18849430.8,
    F: 0,
    G: -687695.57,
    H: 0,
    I: -0.04,
    bankname: "XX有限公司",
    rn: 10,
  },
  {
    A: -1280625.81,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: -1280625.81,
    H: 0,
    I: -0.08,
    bankname: "XX有限公司",
    rn: 11,
  },
  {
    A: -877079.6,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: -877079.6,
    H: 0,
    I: -0.05,
    bankname: "XX有限公司",
    rn: 12,
  },
  {
    A: -3116.03,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: -3116.03,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 13,
  },
  {
    A: -72671.45,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: -72671.45,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 14,
  },
  {
    A: -72204.29,
    B: 0,
    C: 553548.93,
    D: 0,
    E: 682296.5,
    F: 0,
    G: 56543.28,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 15,
  },
  {
    A: 0,
    B: 0,
    C: 668877.65,
    D: 0,
    E: 359630.31,
    F: 0,
    G: -309247.34,
    H: 0,
    I: -0.02,
    bankname: "XX有限公司",
    rn: 16,
  },
  {
    A: 6264.62,
    B: 0,
    C: 18827.67,
    D: 0,
    E: 0,
    F: 0,
    G: -12563.05,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 17,
  },
  {
    A: -387098.43,
    B: 0,
    C: 16735743.72,
    D: 0,
    E: 23301793.57,
    F: 0,
    G: 6178951.42,
    H: 0,
    I: 0.38,
    bankname: "XX有限公司",
    rn: 18,
  },
  {
    A: -123.13,
    B: 0,
    C: 0,
    D: 0,
    E: 123.13,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 19,
  },
  {
    A: -415576.23,
    B: 0,
    C: 18094538.93,
    D: 0,
    E: 17840611.7,
    F: 0,
    G: -669503.46,
    H: 0,
    I: -0.04,
    bankname: "XX有限公司",
    rn: 20,
  },
  {
    A: -703172.29,
    B: 0,
    C: 17474072.68,
    D: 0,
    E: 18355839.92,
    F: 0,
    G: 178594.95,
    H: 0,
    I: 0.01,
    bankname: "XX有限公司",
    rn: 21,
  },
  {
    A: -518706.32,
    B: 0,
    C: 5966725.34,
    D: 0,
    E: 6288742.72,
    F: 0,
    G: -196688.94,
    H: 0,
    I: -0.01,
    bankname: "XX有限公司",
    rn: 22,
  },
  {
    A: 0,
    B: 0,
    C: 125693.61,
    D: 0,
    E: 126755.31,
    F: 0,
    G: 1061.7,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 23,
  },
  {
    A: 815596.6,
    B: 0,
    C: 7716708.28,
    D: 0,
    E: 8165363.33,
    F: 0,
    G: 1264251.65,
    H: 0,
    I: 0.08,
    bankname: "XX有限公司",
    rn: 24,
  },
  {
    A: 718336.72,
    B: 0,
    C: 1027792.61,
    D: 0,
    E: 886517.81,
    F: 0,
    G: 577061.92,
    H: 0,
    I: 0.04,
    bankname: "XX有限公司",
    rn: 25,
  },
  {
    A: 163742.37,
    B: 0,
    C: 2872626.37,
    D: 0,
    E: 2969344.96,
    F: 0,
    G: 260460.96,
    H: 0,
    I: 0.02,
    bankname: "XX有限公司",
    rn: 26,
  },
  {
    A: 38053.74,
    B: 0,
    C: 55665.55,
    D: 0,
    E: 17533.84,
    F: 0,
    G: -77.97,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 27,
  },
  {
    A: 18679.7,
    B: 0,
    C: 0,
    D: 0,
    E: -22803.03,
    F: 0,
    G: -4123.33,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 28,
  },
  {
    A: -10054.98,
    B: 0,
    C: 0,
    D: 0,
    E: 10054.98,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 29,
  },
  {
    A: -864549.25,
    B: 0,
    C: -864549.25,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 30,
  },
  {
    A: 70178.61,
    B: 0,
    C: 70178.61,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 31,
  },
  {
    A: 153123.16,
    B: 0,
    C: 169787.88,
    D: 0,
    E: 16664.72,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 32,
  },
  {
    A: 104885.48,
    B: 0,
    C: 9842335.58,
    D: 0,
    E: 9737450.11,
    F: 0,
    G: 0.01,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 33,
  },
  {
    A: 17321.88,
    B: 0,
    C: 24054.51,
    D: 0,
    E: 6732.63,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 34,
  },
  {
    A: 3026859.75,
    B: 0,
    C: 39174015.24,
    D: 0,
    E: 25675123.22,
    F: 0,
    G: -10472032.27,
    H: 0,
    I: -0.64,
    bankname: "XX有限公司",
    rn: 35,
  },
  {
    A: 1517.34,
    B: 0,
    C: 441193.57,
    D: 0,
    E: 470969.78,
    F: 0,
    G: 31293.55,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 36,
  },
  {
    A: 0,
    B: 0,
    C: 3074577.92,
    D: 0,
    E: 3074577.92,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 37,
  },
  {
    A: 874244.73,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 874244.73,
    H: 0,
    I: 0.05,
    bankname: "XX有限公司",
    rn: 38,
  },
  {
    A: 1866.26,
    B: 0,
    C: 23721963.73,
    D: 0,
    E: 23610981.56,
    F: 0,
    G: -109115.91,
    H: 0,
    I: -0.01,
    bankname: "XX有限公司",
    rn: 39,
  },
  {
    A: 314173.94,
    B: 0,
    C: 314173.94,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 40,
  },
  {
    A: -53536.61,
    B: 0,
    C: 186726.59,
    D: 0,
    E: 239999,
    F: 0,
    G: -264.2,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 41,
  },
  {
    A: -70104.49,
    B: 0,
    C: -70178.61,
    D: 0,
    E: 0,
    F: 0,
    G: 74.12,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 42,
  },
  {
    A: 0,
    B: 0,
    C: 509439.9,
    D: 0,
    E: 513519.49,
    F: 0,
    G: 4079.59,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 43,
  },
  {
    A: -93374.19,
    B: 0,
    C: 442358.02,
    D: 0,
    E: 568503.51,
    F: 0,
    G: 32771.3,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 44,
  },
  {
    A: -80448.62,
    B: 0,
    C: 256428.57,
    D: 0,
    E: 374218.06,
    F: 0,
    G: 37340.87,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 45,
  },
  {
    A: 14386.56,
    B: 0,
    C: 2284.43,
    D: 0,
    E: 0,
    F: 0,
    G: 12102.13,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 46,
  },
  {
    A: -1006184.21,
    B: 0,
    C: 19314682.71,
    D: 0,
    E: 20521674.03,
    F: 0,
    G: 200807.11,
    H: 0,
    I: 0.01,
    bankname: "XX有限公司",
    rn: 47,
  },
  {
    A: 34081055.57,
    B: 0,
    C: 325889384.98,
    D: 0,
    E: 293168438.59,
    F: 0,
    G: 1360109.18,
    H: 0,
    I: 0.08,
    bankname: "XX有限公司",
    rn: 48,
  },
  {
    A: 0,
    B: 0,
    C: 189949.38,
    D: 0,
    E: 189949.38,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    bankname: "XX有限公司",
    rn: 49,
  },
  {
    A: -1029416.05,
    B: 0,
    C: 22592241.8,
    D: 0,
    E: 22825897.38,
    F: 0,
    G: -795760.47,
    H: 0,
    I: -0.05,
    bankname: "XX有限公司",
    rn: 50,
  },
];
export { columns, datas };
