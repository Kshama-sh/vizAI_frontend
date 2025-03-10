// import React from "react";
// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectItem,
//   SelectContent,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// function Database() {
//   const [step, setStep] = useState(1);

//   const handleDbSubmit = (e) => {
//     e.preventDefault();
//     console.log("DB Details:", dbDetails);
//     setTimeout(() => {
//       alert("Database verified successfully!");
//       setStep(2);
//     }, 1000);
//   };
//   return (
//     <div>
//       <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-md m-auto mt-20">
//         <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
//           {step === 1 ? "Connect Your Database" : "Setup Domain & Role"}
//         </h2>
//         {step == 1 ? (
//           <form onSubmit={handleDbSubmit} className="mt-6 w-full max-w-sm">
//             <Label className="flex text-gray-700 font-medium flex-start">
//               Database Type
//             </Label>
//             <Select>
//               <SelectTrigger className="w-full p-3 mb-3 border border-gray-300 rounded-lg">
//                 <SelectValue placeholder="Select database type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="mysql">MySQL</SelectItem>
//                 <SelectItem value="postgres">Postgres</SelectItem>
//                 <SelectItem value="sqlite">SQLite</SelectItem>
//               </SelectContent>
//             </Select>
//             <Label className="flex text-gray-700 font-medium flex-start">
//               Name
//             </Label>
//             <Input
//               type="text"
//               placeholder="Enter database Name"
//               className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
//             />
//             <Label className="flex text-gray-700 font-medium flex-start">
//               Host
//             </Label>
//             <Input
//               type="text"
//               placeholder="Enter Host"
//               className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
//             />
//             <Label className="flex text-gray-700 font-medium flex-start">
//               Port
//             </Label>
//             <Input
//               type="text"
//               placeholder="Enter Port number"
//               className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
//             />
//             <Label className="flex text-gray-700 font-medium flex-start">
//               User
//             </Label>
//             <Input
//               type="text"
//               placeholder="Enter your Username"
//               className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
//             />
//             <Label className="flex text-gray-700 font-medium flex-start">
//               Password
//             </Label>
//             <Input
//               type="password"
//               placeholder="Enter your Password"
//               className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
//             />
//             <Button
//               type="submit"
//               className="w-full bg-blue-950 text-white py-3 rounded-lg transition"
//             >
//               Verify Database
//             </Button>
//           </form>
//         ) : (
//           <form className="mt-6 w-full max-w-sm">
//             <Label className="flex text-gray-700 font-medium flex-start">
//               Domain
//             </Label>
//             <Input
//               type="text"
//               placeholder="Enter your domain"
//               className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
//             />
//             <Label className="flex text-gray-700 font-medium flex-start">
//               User Role
//             </Label>
//             <Input
//               type="text"
//               placeholder="Enter your role"
//               className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
//             />
//             <Button
//               type="submit"
//               className="w-full bg-blue-950 text-white py-3 rounded-lg transition"
//             >
//               Submit
//             </Button>
//           </form>
//         )}
//       </Card>
//     </div>
//   );
// }
// export default Database;
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Database() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dbType: "",
    dbName: "",
    host: "",
    port: "",
    user: "",
    password: "",
    domain: "",
    userRole: "",
  });

  // Update form fields dynamically
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle database type separately for Select component
  const handleDbTypeChange = (value) => {
    setFormData({ ...formData, dbType: value });
  };

  // Mock Database Verification
  const handleDbSubmit = (e) => {
    e.preventDefault();
    console.log("Database Details:", formData);

    setTimeout(() => {
      alert("Database verified successfully!");
      setStep(2);
    }, 1000);
  };

  // Handle Final Submission
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    console.log("Final Submission:", formData);
    alert("Setup Completed!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
          {step === 1 ? "Connect Your Database" : "Setup Domain & Role"}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleDbSubmit} className="space-y-4">
            <div>
              <Label>Database Type</Label>
              <Select onValueChange={handleDbTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgres">Postgres</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Name</Label>
              <Input
                name="dbName"
                type="text"
                value={formData.dbName}
                onChange={handleChange}
                placeholder="Enter database name"
              />
            </div>

            <div>
              <Label>Host</Label>
              <Input
                name="host"
                type="text"
                value={formData.host}
                onChange={handleChange}
                placeholder="Enter host"
              />
            </div>

            <div>
              <Label>Port</Label>
              <Input
                name="port"
                type="text"
                value={formData.port}
                onChange={handleChange}
                placeholder="Enter port number"
              />
            </div>

            <div>
              <Label>User</Label>
              <Input
                name="user"
                type="text"
                value={formData.user}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>

            <Button type="submit" className="w-full bg-blue-950">
              Verify Database
            </Button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div>
              <Label>Domain</Label>
              <Input
                name="domain"
                type="text"
                value={formData.domain}
                onChange={handleChange}
                placeholder="Enter your domain"
              />
            </div>

            <div>
              <Label>User Role</Label>
              <Input
                name="userrole"
                type="text"
                value={formData.userRole}
                onChange={handleChange}
                placeholder="Enter your role"
              />
            </div>

            <Button type="submit" className="w-full bg-green-600">
              Submit
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default Database;
