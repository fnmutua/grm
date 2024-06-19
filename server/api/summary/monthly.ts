import mongoose from 'mongoose';
import Grievance from "../../models/grievance";

export default defineEventHandler(async (req) => {
    const { gbv, page, pageCount, filter_fields, filter_values } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('Database connected. Summary..');

        // Construct the filter query dynamically
        let filterQuery: Record<string, any> = {};
        if (Array.isArray(filter_fields) && Array.isArray(filter_values) && filter_fields.length === filter_values.length) {
            filter_fields.forEach((field, index) => {
                if (filter_values[index] !== null && filter_values[index] !== undefined) {
                    filterQuery[field] = filter_values[index];
                }
            });
        }

        // Always ensure date_reported is a date
        filterQuery.date_reported = { $type: "date" };

        // Aggregating grievances by month and by status with filters
        const summary = await Grievance.aggregate([
            {
                $match: filterQuery
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date_reported" },
                        month: { $month: "$date_reported" },
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Determine the range of years and months
        const yearMonths = {};
        summary.forEach(item => {
            const { year, month } = item._id;
            if (!yearMonths[year]) {
                yearMonths[year] = new Set();
            }
            yearMonths[year].add(month);
        });

        // Create a complete range of dates from the earliest to the latest date
        const allDates = [];
        const startDate = new Date(Math.min(...Object.keys(yearMonths).map(year => new Date(year, 0))));
        const endDate = new Date(Math.max(...Object.keys(yearMonths).map(year => new Date(year, 11))));

        let currentDate = startDate;
        while (currentDate <= endDate) {
            allDates.push(currentDate.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Initialize formattedSummary with zeros for all dates
        const formattedSummary = {};
        summary.forEach(item => {
            const { status } = item._id;
            if (!formattedSummary[status]) {
                formattedSummary[status] = Array(allDates.length).fill(0); // Initialize array with zeros
            }
        });

        // Populate the counts for existing data points
        summary.forEach(item => {
            const { year, month, status } = item._id;
            const date = new Date(year, month - 1).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            const index = allDates.indexOf(date);
            if (index !== -1) {
                formattedSummary[status][index] = item.count;
            }
        });

        // Convert formattedSummary to the structure Highcharts expects
        const series = Object.keys(formattedSummary).map(status => ({
            name: status,
            data: formattedSummary[status]
        }));

        return {
            message: 'summary found',
            dates: allDates,
            series: series,
            type: 'line',
            code: '0000'
        };

    } catch (error) {
        console.error('Error during summary:', error);
        return {
            message: 'Internal server error',
            code: '9999'
        };
    } finally {
        // Close the MongoDB connection
        // await mongoose.disconnect();
        console.log('Database disconnected...');
    }
});
