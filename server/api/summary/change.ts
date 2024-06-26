import mongoose from "mongoose";
import Grievance from "./../../models/grievance";

// export default defineEventHandler(async (req) => {
//     const { status, gbv, page, pageCount,filter_fields, filter_values } = await readBody(req);
//     const mongoString = process.env.MONGODB_URI;
  
//     try {
//       await mongoose.connect(mongoString, { dbName: "grm" });
//       console.log("Database connected.");
  
//       const currentDate = new Date();
//       const currentMonth = currentDate.getMonth();
//       const currentYear = currentDate.getFullYear();
  
//       // Calculate the start and end dates for the current month
//       const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
//       const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
  
//       // Calculate the start and end dates for the previous month
//       const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
//       const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
//       const previousMonthFirstDay = new Date(previousMonthYear, previousMonth, 1);
//       const previousMonthLastDay = new Date(previousMonthYear, previousMonth + 1, 0, 23, 59, 59, 999);
  
//       console.log('firstDayOfMonth', firstDayOfMonth);
//       console.log('lastDayOfMonth', lastDayOfMonth);
//       console.log('previousMonthFirstDay', previousMonthFirstDay);
//       console.log('previousMonthLastDay', previousMonthLastDay);
  
//       // Aggregate pipeline for current month
//       const currentMonthAggregate = await Grievance.aggregate([
//         {
//           $match: {
//             date_reported: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
//           }
//         },
//         {
//           $group: {
//             _id: "$status",
//             totalAmount: { $sum: 1 }
//           }
//         }
//       ]);
  
//       console.log('currentMonthAggregate', currentMonthAggregate);
  
//       // Aggregate pipeline for previous month
//       const previousMonthAggregate = await Grievance.aggregate([
//         {
//           $match: {
//             date_reported: { $gte: previousMonthFirstDay, $lte: previousMonthLastDay }
//           }
//         },
//         {
//           $group: {
//             _id: "$status",
//             totalAmount: { $sum: 1 }
//           }
//         }
//       ]);
  
//       console.log('previousMonthAggregate', previousMonthAggregate);
  
//       // Convert aggregation results to a dictionary for easy lookup
//       const currentMonthTotals = {};
//       currentMonthAggregate.forEach(item => {
//         currentMonthTotals[item._id] = item.totalAmount;
//       });
  
//       const previousMonthTotals = {};
//       previousMonthAggregate.forEach(item => {
//         previousMonthTotals[item._id] = item.totalAmount;
//       });
  
//       // Calculate percentage change for each status
//       const percentageChanges = {};
//       Object.keys(currentMonthTotals).forEach(status => {
//         const currentTotal = currentMonthTotals[status] || 0;
//         const previousTotal = previousMonthTotals[status] || 0;
//         const percentageChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : (currentTotal > 0 ? 100 : 0);
//         percentageChanges[status] = percentageChange;
//       });

//        // Calculate total amounts for current and previous months
//     const currentMonthTotal = Object.values(currentMonthTotals).reduce((sum, value) => sum + value, 0);
//     const previousMonthTotal = Object.values(previousMonthTotals).reduce((sum, value) => sum + value, 0);

//     // Calculate total percentage change
//     const totalPercentageChange = previousMonthTotal > 0 ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : (currentMonthTotal > 0 ? 100 : 0);

//     percentageChanges.Total = totalPercentageChange
      
//    console.log('percentageChanges',percentageChanges)
//       return {
//         message: "Percentage changes found",
//         data: percentageChanges,
//         code: "0000"
//       };
//     } catch (error) {
//       console.error("Error during summary:", error);
//       return {
//         message: "Internal server error",
//         code: "9999"
//       };
//     } finally {
//       // Close the MongoDB connection
//       // await mongoose.disconnect();
//       // console.log('Database disconnected...');
//     }
//   });
  
  
export default defineEventHandler(async (req) => {
  const { status, gbv, page, pageCount, filter_fields, filter_values } = await readBody(req);
  const mongoString = process.env.MONGODB_URI;

  try {
    await mongoose.connect(mongoString, { dbName: "grm" });
    console.log("Database connected.");

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate the start and end dates for the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // Calculate the start and end dates for the previous month
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthFirstDay = new Date(previousMonthYear, previousMonth, 1);
    const previousMonthLastDay = new Date(previousMonthYear, previousMonth + 1, 0, 23, 59, 59, 999);

    console.log('firstDayOfMonth', firstDayOfMonth);
    console.log('lastDayOfMonth', lastDayOfMonth);
    console.log('previousMonthFirstDay', previousMonthFirstDay);
    console.log('previousMonthLastDay', previousMonthLastDay);

    // Construct the filter query dynamically
    let filterQuery: Record<string, any> = {};
    if (Array.isArray(filter_fields) && Array.isArray(filter_values) && filter_fields.length === filter_values.length) {
      filter_fields.forEach((field, index) => {
        if (filter_values[index] !== null) {
          filterQuery[field] = filter_values[index];
        }
      });
    }

    // Aggregate pipeline for current month
    const currentMonthAggregate = await Grievance.aggregate([
      {
        $match: {
          ...filterQuery,
          date_reported: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        }
      },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: 1 }
        }
      }
    ]);

    console.log('currentMonthAggregate', currentMonthAggregate);

    // Aggregate pipeline for previous month
    const previousMonthAggregate = await Grievance.aggregate([
      {
        $match: {
          ...filterQuery,
          date_reported: { $gte: previousMonthFirstDay, $lte: previousMonthLastDay }
        }
      },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: 1 }
        }
      }
    ]);

    console.log('previousMonthAggregate', previousMonthAggregate);

    // Convert aggregation results to a dictionary for easy lookup
    const currentMonthTotals = {};
    currentMonthAggregate.forEach(item => {
      currentMonthTotals[item._id] = item.totalAmount;
    });

    const previousMonthTotals = {};
    previousMonthAggregate.forEach(item => {
      previousMonthTotals[item._id] = item.totalAmount;
    });

    // Calculate percentage change for each status
    const percentageChanges = {};
    Object.keys(currentMonthTotals).forEach(status => {
      const currentTotal = currentMonthTotals[status] || 0;
      const previousTotal = previousMonthTotals[status] || 0;
      const percentageChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : (currentTotal > 0 ? 100 : 0);
      percentageChanges[status] = percentageChange;
    });

    // Calculate total amounts for current and previous months
    const currentMonthTotal = Object.values(currentMonthTotals).reduce((sum, value) => sum + value, 0);
    const previousMonthTotal = Object.values(previousMonthTotals).reduce((sum, value) => sum + value, 0);

    // Calculate total percentage change
    const totalPercentageChange = previousMonthTotal > 0 ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : (currentMonthTotal > 0 ? 100 : 0);
    percentageChanges.Total = totalPercentageChange;

    console.log('percentageChanges', percentageChanges);
    return {
      message: "Percentage changes found",
      data: percentageChanges,
      code: "0000"
    };
  } catch (error) {
    console.error("Error during summary:", error);
    return {
      message: "Internal server error",
      code: "9999"
    };
  } finally {
    // Close the MongoDB connection
    //await mongoose.disconnect();
    console.log('Database disconnected...');
  }
});
