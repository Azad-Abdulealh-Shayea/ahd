"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatSar } from "@/features/contracts/display";

export type DashboardTrendDatum = {
  label: string;
  total: number;
  funded: number;
  held: number;
  released: number;
};

export type DashboardPieDatum = {
  name: string;
  value: number;
  fill: string;
};

const trendConfig = {
  total: {
    label: "قيمة العقود",
    color: "var(--chart-1)",
  },
  funded: {
    label: "ممول",
    color: "var(--chart-2)",
  },
  held: {
    label: "محجوز",
    color: "var(--chart-3)",
  },
  released: {
    label: "مصروف",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const pieConfig = {
  value: {
    label: "الحالة",
  },
  active: {
    label: "نشط",
    color: "var(--success)",
  },
  waiting: {
    label: "ينتظر",
    color: "var(--warning)",
  },
  completed: {
    label: "مكتمل",
    color: "var(--brand-navy)",
  },
  stopped: {
    label: "متوقف",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

export function DashboardTrendChart({ data }: { data: DashboardTrendDatum[] }) {
  return (
    <ChartContainer
      config={trendConfig}
      className="aspect-auto h-56 w-full"
      initialDimension={{ width: 800, height: 224 }}
    >
      <BarChart
        accessibilityLayer
        data={data}
        barGap={4}
        barCategoryGap={18}
        margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          width={76}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) =>
            new Intl.NumberFormat("ar-SA", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(value)
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={(value) =>
                typeof value === "number" ? formatSar(value) : value
              }
            />
          }
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="funded"
          fill="var(--color-funded)"
          radius={[4, 4, 0, 0]}
        />
        <Bar dataKey="held" fill="var(--color-held)" radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="released"
          fill="var(--color-released)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}

export function DashboardStatusPie({
  data,
  total,
}: {
  data: DashboardPieDatum[];
  total: number;
}) {
  return (
    <ChartContainer
      config={pieConfig}
      className="aspect-auto h-56 w-full"
      initialDimension={{ width: 280, height: 224 }}
    >
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={76}
          strokeWidth={4}
        >
          {data.map((item) => (
            <Cell key={item.name} fill={item.fill} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                return null;
              }

              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-foreground text-3xl font-semibold"
                  >
                    {total.toLocaleString("ar-SA")}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy ?? 0) + 24}
                    className="fill-muted-foreground text-xs"
                  >
                    عقد
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
