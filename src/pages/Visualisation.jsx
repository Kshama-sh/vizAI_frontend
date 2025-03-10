import React from "react";
import { Card } from "@/components/ui/card";
function Visualisation() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
      <div>
        <Card>chart</Card>
      </div>
      <div>
        <Card>report</Card>
      </div>
    </div>
  );
}
export default Visualisation;
