import { motion } from "motion/react";
import { ShoppingCart, Users, Smile, Activity } from "lucide-react";

export default function ActivityItem({ type, description, time }) {
  const typeStyles = {
    vente: "bg-green-500/20 text-green-400",
    client: "bg-blue-500/20 text-blue-400",
    feedback: "bg-yellow-500/20 text-yellow-400",
    default: "bg-red-500/20 text-red-400"
  };
  const typeIcons = {
    vente: <ShoppingCart className="h-5 w-5" />,
    client: <Users className="h-5 w-5" />,
    feedback: <Smile className="h-5 w-5" />,
    default: <Activity className="h-5 w-5" />
  };

  return (
    <motion.div 
      className="flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, x: 5 }}
    >
      <motion.div className={`rounded-full p-3 ${typeStyles[type] || typeStyles.default}`} whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
        {typeIcons[type] || typeIcons.default}
      </motion.div>
      <div className="space-y-1 flex-1">
        <p className="text-base text-white">{description}</p>
        <p className="text-sm text-slate-400">{time}</p>
      </div>
    </motion.div>
  );
}
