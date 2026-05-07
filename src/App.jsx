import React, { useMemo, useState } from "react";
                      ₹{expense.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className={`${
                darkMode ? "bg-zinc-900" : "bg-white"
              } rounded-3xl p-6 shadow-xl`}
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-yellow-500" />
                <h2 className="text-2xl font-bold">AI Insights</h2>
              </div>

              <div className="space-y-4 mt-6">
                <div
                  className={`${
                    darkMode ? "bg-zinc-800" : "bg-blue-50"
                  } p-4 rounded-2xl`}
                >
                  You are spending more on food this month.
                </div>

                <div
                  className={`${
                    darkMode ? "bg-zinc-800" : "bg-green-50"
                  } p-4 rounded-2xl`}
                >
                  Your shopping expenses decreased by 12%.
                </div>

                <div
                  className={`${
                    darkMode ? "bg-zinc-800" : "bg-yellow-50"
                  } p-4 rounded-2xl`}
                >
                  You are within your monthly budget.
                </div>
              </div>
            </div>

            <div
              className={`${
                darkMode ? "bg-zinc-900" : "bg-white"
              } rounded-3xl p-6 shadow-xl`}
            >
              <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>

              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-sm">Today</p>
                  <h1 className="text-3xl font-bold">₹1,250</h1>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">This Week</p>
                  <h1 className="text-3xl font-bold">₹8,400</h1>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">This Month</p>
                  <h1 className="text-3xl font-bold">₹{totalExpense}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
