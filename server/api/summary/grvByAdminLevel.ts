import mongoose from 'mongoose';
import Grievance from "../../models/grievance";

export default defineEventHandler(async (req) => {
    const { gbv, page, pageCount, filter_fields, filter_values, admin_level } = await readBody(req);
    const mongoString = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoString, { dbName: 'grm' });
        console.log('Database connected. Summary..');

        // Construct the filter query dynamically
        let filterQuery = {};
        if (Array.isArray(filter_fields) && Array.isArray(filter_values) && filter_fields.length === filter_values.length) {
            filter_fields.forEach((field, index) => {
                if (filter_values[index]) {
                    filterQuery[field] = filter_values[index];
                }
            });
        }

        // Always include the gbv filter if provided
        if (gbv) {
            filterQuery.gbv = gbv;
        }

        // Aggregating grievances by month and by county with filters
        const summary = await Grievance.aggregate([
            {
                $match: filterQuery
            },
            {
                $group: {
                    _id: {
                        year: { $year: { $toDate: "$date_reported" } },
                        month: { $month: { $toDate: "$date_reported" } },
                        [admin_level]: "$county"
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

        let currentDate = new Date(startDate); // Use a new Date instance to avoid modifying startDate directly
        while (currentDate <= endDate) {
            const formattedDate = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(currentDate)}-${currentDate.getFullYear()}`;
            allDates.push(formattedDate); // Format date as Jan-YYYY
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Initialize formattedSummary with zeros for all dates
        const formattedSummary = {};
        summary.forEach(item => {
            const { admin } = item._id;
            if (!formattedSummary[admin]) {
                formattedSummary[admin] = Array(allDates.length).fill(0); // Initialize array with zeros
            }
        });

        // Populate the counts for existing data points
        summary.forEach(item => {
            const { year, month, admin } = item._id;
            const date = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(year, month - 1))}-${year}`;
            const index = allDates.indexOf(date);
            if (index !== -1) {
                formattedSummary[admin][index] = item.count;
            }
        });

        // Convert formattedSummary to the structure Highcharts expects
        const series = Object.keys(formattedSummary).map(admin => ({
            name: admin,
            data: formattedSummary[admin]
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
