import React, { useEffect, useState } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobLevel, setJobLevel] = useState("All");

  useEffect(() => {
    axios
      .get("https://jobicy.com/api/v2/remote-jobs")
      .then((res) => setJobs(res.data.jobs))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const title = job.jobTitle || "";
    const type = job.jobType ? job.jobType[0] : "";
    const location = job.jobGeo || "";
    const level = job.jobLevel || "";

    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "All" || type.toLowerCase() === category.toLowerCase();
    const matchesLocation =
      locationFilter === "" ||
      location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesLevel = jobLevel === "All" || level === jobLevel;

    return matchesSearch && matchesCategory && matchesLocation && matchesLevel;
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

      <div className="relative max-w-7xl mx-auto p-8 space-y-10 text-gray-900">
        {/* Top Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-lg z-10">
          <Input
            type="text"
            placeholder="Search by job title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="col-span-1 border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="col-span-1 border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />

          <Select value={jobLevel} onValueChange={setJobLevel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select job level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Entry">Entry</SelectItem>
              <SelectItem value="Mid">Mid</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Cards */}
        <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 z-10">
          <AnimatePresence>
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                layout
              >
                <Card className="flex flex-col justify-between h-full shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-3">
                      {job.companyLogo && (
                        <img
                          src={job.companyLogo}
                          alt={`${job.companyName} logo`}
                          className="w-14 h-14 object-contain rounded-md"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {job.jobTitle || "No Title"}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {job.companyName || "Unknown Company"} —{" "}
                          {job.jobGeo || "Remote"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">
                      {(job.jobDescription || "No description available")
                        .replace(/<[^>]*>?/gm, "")
                        .slice(0, 180)}{" "}
                      ...
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-center">
                    <Dialog>
                      <DialogTrigger className="inline-block px-7 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                        View Details
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl p-8 rounded-xl shadow-xl bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-bold text-gray-900">
                            {job.jobTitle}
                          </DialogTitle>
                        </DialogHeader>

                        <DialogDescription className="mt-6 text-gray-800 text-base space-y-5">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: job.jobExcerpt || "",
                            }}
                            className="prose prose-blue max-w-none"
                          />

                          <div className="space-y-2 text-gray-700 text-sm font-medium">
                            <p>
                              <span className="font-semibold">Company:</span>{" "}
                              {job.companyName || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">Job Level:</span>{" "}
                              {job.jobLevel || "Fresher"}
                            </p>
                            <p>
                              <span className="font-semibold">Location:</span>{" "}
                              {job.jobGeo || "Remote"}
                            </p>
                            <p>
                              <span className="font-semibold">Type:</span>{" "}
                              {job.jobType ? job.jobType.join(", ") : "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                Published Date:
                              </span>{" "}
                              {job.pubDate || "N/A"}
                            </p>
                          </div>

                          <div className="mt-8 text-center">
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                              Apply Here
                            </a>
                          </div>
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
