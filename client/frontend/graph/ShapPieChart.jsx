import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function ShapPieChart({ factors }) {

  const increaseRisk = factors
    .filter((factor) => factor.shap_value > 0)
    .reduce(
      (total, factor) => total + Math.abs(factor.shap_value),
      0
    );

  const decreaseRisk = factors
    .filter((factor) => factor.shap_value < 0)
    .reduce(
      (total, factor) => total + Math.abs(factor.shap_value),
      0
    );

  const data = [
    {
      name: "Increases Risk",
      value: increaseRisk
    },
    {
      name: "Decreases Risk",
      value: decreaseRisk
    }
  ];

  return (
    <div className="w-full h-112.5 bg-white rounded shadow p-6">

      <h2 className="text-xl font-bold mb-2">
        SHAP Impact Distribution
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Distribution of factors influencing the prediction
      </p>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
          >

            <Cell fill="#ef4444" />
            <Cell fill="#22c55e" />

          </Pie>

          <Tooltip
            formatter={(value) =>
              Number(value).toFixed(4)
            }
          />

          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ShapPieChart;