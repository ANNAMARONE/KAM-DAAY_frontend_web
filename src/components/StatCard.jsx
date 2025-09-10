import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function StatCard({ title, value, icon: Icon, color="white", trend="+0%", trendColor="text-green-400" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.6 }}
    >
      <Card className={`bg-gradient-to-br ${color}/80 border-${color}/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
            <Icon className="h-8 w-8 text-white/70" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div className="text-4xl text-white mb-2" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            {value}
          </motion.div>
          <div className="flex items-center text-base">
            <span className={`${trendColor} mr-2`}>{trend}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
