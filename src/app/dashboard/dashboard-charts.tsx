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

export type PaymentPipelineDatum = {
  name: string;
  value: number;
  fill: string;
};

export type MilestoneProgressDatum = {
  stage: string;
  count: number;
  fill: string;
};

export type DashboardPieDatum = {
  name: string;
  value: number;
  fill: string;
};

const pipelineConfig = {
  value: {
    label: "المبلغ",
  },
  funded: {
    label: "ممول",
    color: "var(--success)",
  },
  held: {
    label: "محجوز",
    color: "var(--warning)",
  },
  released: {
    label: "مصرف",
    color: "var(--brand-navy)",
  },
} satisfies ChartConfig;

const milestoneConfig = {
  value: {
    label: "المراحل",
  },
  awaiting: {
    label: "ينتظر تمويل",
    color: "var(--muted)",
  },
  funded: {
    label: "قيد التنفيذ",
    color: "var(--primary)",
  },
  review: {
    label: "قيد المراجعة",
    color: "var(--warning)",
  },
  released: {
    label: "مكتملة",
    color: "var(--success)",
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

export function PaymentPipelineChart({
  data,
}: {
  data: PaymentPipelineDatum[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartContainer
      config={pipelineConfig}
      className="aspect-auto h-32 w-full"
      initialDimension={{ width: 400, height: 128 }}
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis
          type="number"
          hide
          domain={[0, total]}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatSar(value as number)}
            />
          }
        />
        <Bar
          dataKey="value"
          radius={[0, 4, 4, 0]}
          barSize={28}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function MilestoneProgressChart({
  data,
}: {
  data: MilestoneProgressDatum[];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <ChartContainer
      config={milestoneConfig}
      className="aspect-auto h-40 w-full"
      initialDimension={{ width: 400, height: 160 }}
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis
          type="number"
          hide
          domain={[0, total]}
        />
        <YAxis
          type="category"
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          width={90}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `${value as number} مرحلة`}
            />
          }
        />
        <Bar
          dataKey="count"
          radius={[0, 4, 4, 0]}
          barSize={24}
        >
          {data.map((entry) => (
            <Cell key={entry.stage} fill={entry.fill} />
          ))}
        </Bar>
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
