import React, { useEffect, useState } from "react";
import ContentPanel from "../Table/ContentPanel";
import { useTheme } from "../../Context/ThemeContext";
import Chart from "react-apexcharts";

const LineChart = ({ create_data, update_data, create_table_title, update_table_title }) => {
    const { theme } = useTheme();

    // CREATE
    const [CreateChartOptions, setCreateChartOptions] = useState({
        chart: {
            type: "line",
            height: 350,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        markers: {
            size: 5,
        },
        xaxis: {
            type: "datetime",
            categories: [],
        },
    });

    const [CreateChartSeries, setCreateChartSeries] = useState([
        {
            type: "area",
            name: "Created Item/s",
            data: [],
        },
    ]);
    

    useEffect(() => {
        const newColor = theme === "bg-skin-blue" ? '#134B70' : '#A4A3A4';

        if (create_data && create_data.length > 0) {
            const dates = create_data.map((data) => data.date);
            const counts = create_data.map((data) => data.count);

            setCreateChartOptions((prevOptions) => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories: dates,
                },
                colors: [newColor],
            }));

            setCreateChartSeries([
                {
                    type: "area",
                    name: "Created Item/s",
                    data: counts,
                },
            ]);
        }
    }, [update_data, theme]);

    // UPDATE
    const [UpdateChartOptions, setUpdateChartOptions] = useState({
        chart: {
            type: "line",
            height: 350,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        markers: {
            size: 5,
        },
        xaxis: {
            type: "datetime",
            categories: [],
        },
    });

    const [UpdateChartSeries, setUpdateChartSeries] = useState([
        {
            type: "area",
            name: "Updated Item/s",
            data: [],
        },
    ]);


    useEffect(() => {
        const newColor = theme === "bg-skin-blue" ? '#134B70' : '#A4A3A4';

        if (update_data && update_data.length > 0) {
            const dates = update_data.map((data) => data.date);
            const counts = update_data.map((data) => data.count);

            setUpdateChartOptions((prevOptions) => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories: dates,
                },
                colors: [newColor],
            }));

            setUpdateChartSeries([
                {
                    type: "area",
                    name: "Updated Item/s",
                    data: counts,
                },
            ]);
        }
    }, [create_data, theme]);

    return (
        <div className="mt-5">
            <p className="mb-2 font-semibold text-sm">{create_table_title}</p>
            <div className="border p-2 rounded-lg mb-5">
                <Chart
                    options={CreateChartOptions}
                    series={CreateChartSeries}
                    height={300}
                />
            </div>
            <p className="mb-2 font-semibold text-sm">{update_table_title}</p>
            <div className="border p-2 rounded-lg">
                <Chart
                    options={UpdateChartOptions}
                    series={UpdateChartSeries}
                    height={300}
                />
            </div>
            
        </div>
    );
};

export default LineChart;
