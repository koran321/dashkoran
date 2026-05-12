import { getDb } from "@/lib/mongodb";

export class StatsService {
  static async getDashboardStats() {
    const db = await getDb();
    
    // Original Logic: 
    // totalEarned = Sum(advancePaid) for all tasks + Sum(totalValue + bonus - advancePaid) for done tasks
    // expectedEarnings = Sum(totalValue + bonus - advancePaid) for active tasks
    
    const tasks = await db.collection("assignment").find().toArray();
    
    let totalEarned = 0;
    let expectedEarnings = 0;
    let completedTasks = 0;
    
    tasks.forEach(tk => {
      const total = Number(tk.totalValue) || 0;
      const advance = Number(tk.advancePaid) || 0;
      const bonus = Number(tk.bonus) || 0;
      const isDone = tk.status === 'done';
      
      const finalTaskValue = total + bonus;
      const balance = finalTaskValue - advance;
      
      if (isDone) {
        totalEarned += finalTaskValue; // If done, we received everything
        completedTasks++;
      } else {
        totalEarned += advance; // If not done, we only received advance
        expectedEarnings += balance; // We expect the balance
      }
    });

    const expensesAgg = await db.collection("accounts").aggregate([
      { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
    ]).toArray();

    const totalExpenses = expensesAgg[0]?.total || 0;
    
    // Income by WorkType (Based on received amount)
    const incomeByWorkType: any = {};
    tasks.forEach(tk => {
      const type = tk.workType || "Other";
      const isDone = tk.status === 'done';
      const received = isDone ? ((Number(tk.totalValue) || 0) + (Number(tk.bonus) || 0)) : (Number(tk.advancePaid) || 0);
      incomeByWorkType[type] = (incomeByWorkType[type] || 0) + received;
    });

    const expensesByCategory = await db.collection("accounts").aggregate([
      { $group: { _id: "$category", total: { $sum: { $toDouble: "$amount" } } } }
    ]).toArray();

    // Writer Contribution
    const writerContribution: any = {};
    const expensesList = await db.collection("accounts").find().toArray();
    
    tasks.forEach(tk => {
      const writerName = tk.assignedTo || "Unassigned";
      const taskExpenses = expensesList
        .filter(e => e.taskId === tk._id.toString())
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      
      const taskNetValue = (Number(tk.totalValue) || 0) + (Number(tk.bonus) || 0) - taskExpenses;
      writerContribution[writerName] = (writerContribution[writerName] || 0) + taskNetValue;
    });
    
    return {
      totalTasks: tasks.length,
      completedTasks,
      totalEarned,
      expectedEarnings,
      totalExpenses,
      netBalance: totalEarned - totalExpenses,
      incomeByWorkType: Object.entries(incomeByWorkType).map(([name, total]) => ({ _id: name, total })),
      expensesByCategory,
      writerContribution: Object.entries(writerContribution).map(([name, total]) => ({ _id: name, total }))
    };
  }

  static async getWriterStats() {
    const db = await getDb();
    const tasks = await db.collection("assignment").find().toArray();
    
    const statsMap: any = {};
    
    tasks.forEach(tk => {
      const writerName = tk.assignedTo || "Unassigned";
      if (!statsMap[writerName]) {
        statsMap[writerName] = { _id: writerName, activeWorkload: 0, totalEarnings: 0, pendingPayments: 0 };
      }
      
      const isDone = tk.status === 'done';
      if (!isDone) statsMap[writerName].activeWorkload++;
      
      const total = (Number(tk.totalValue) || 0) + (Number(tk.bonus) || 0);
      const advance = Number(tk.advancePaid) || 0;
      
      statsMap[writerName].totalEarnings += total;
      statsMap[writerName].pendingPayments += (total - advance);
    });
    
    return Object.values(statsMap);
  }
}
