import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

function ShapBarChart({ factors }) {

  const chartData = factors.map((factor) => ({
    ...factor,
    impact: Math.abs(factor.shap_value)
  }));

 const colors = [
  "#2563EB", // Blue
  "#0891B2", // Cyan
  "#7C3AED", // Purple
  "#0F766E", // Teal
  "#D97706", // Amber
  "#DB2777", // Pink
  "#4F46E5", // Indigo
  "#059669"  // Emerald
];

  return (
    <div className="w-full h-112.5 bg-white rounded shadow p-6">

      <h2 className="text-xl font-bold mb-6">
        Risk Factor Impact
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 80
          }}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="feature"
            angle={-30}
            textAnchor="end"
            interval={0}
          />

          <YAxis />

          <Tooltip
            formatter={(value, name, props) => [
              `${props.payload.shap_value > 0 ? "+" : ""}${props.payload.shap_value.toFixed(4)}`,
              props.payload.shap_value > 0
                ? "Increases Risk"
                : "Decreases Risk"
            ]}
          />

            
            <Bar dataKey="impact" radius={[5, 5, 0, 0]}>
            {chartData.map((factor, index) => (
             <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
            />
            ))}
            </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ShapBarChart;