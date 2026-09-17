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

function ShapWaterfall({ factors, probability }) {

  const baseValue = 0.5;

  let current = baseValue;

  const chartData = [
    {
      feature: "Base Risk",
      base: 0,
      impact: baseValue,
      shap: baseValue,
      type: "base"
    }
  ];

  factors.forEach((factor) => {

    const shap = factor.shap_value;

    const start = current;
    const end = current + shap;

    chartData.push({
      feature: factor.feature,
      base: Math.min(start, end),
      impact: Math.abs(shap),
      shap: shap,
      type: shap >= 0 ? "increase" : "decrease"
    });

    current = end;
  });

  chartData.push({
    feature: "Final Risk",
    base: 0,
    impact: probability,
    shap: probability,
    type: "final"
  });

  return (
    <div className="w-full h-112.5 bg-white rounded shadow p-6">

      <h2 className="text-xl font-bold mb-2">
        Risk Contribution Waterfall
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        How each factor influences the final risk score
      </p>

      <ResponsiveContainer width="100%" height="85%">

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

          <YAxis
            tickFormatter={(value) =>
              `${(value * 100).toFixed(0)}%`
            }
          />

          <Tooltip
            formatter={(value, name, props) => {

              const item = props.payload;

              return [
                `${(item.shap * 100).toFixed(2)}%`,
                item.type === "increase"
                  ? "Increases Risk"
                  : item.type === "decrease"
                    ? "Decreases Risk"
                    : item.type === "base"
                      ? "Base Risk"
                      : "Final Risk"
              ];
            }}
          />

          {/* Invisible bottom portion */}
          <Bar
            dataKey="base"
            stackId="waterfall"
            fill="transparent"
          />

          {/* Actual contribution */}
          <Bar
            dataKey="impact"
            stackId="waterfall"
            radius={[5, 5, 0, 0]}
          >

            {chartData.map((item, index) => (

              <Cell
                key={index}
                fill={
                  item.type === "increase"
                    ? "#EF4444"
                    : item.type === "decrease"
                      ? "#22C55E"
                      : item.type === "base"
                        ? "#64748B"
                        : "#2563EB"
                }
              />

            ))}

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default ShapWaterfall;