import { ChartBarIcon, CopyIcon, LinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import Background from "../components/Background";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Dashboard() {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchUrls = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/url/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUrls(response.data.urls);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUrls();
    }, []);

    const handleDelete = async (shortUrl) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/url/delete`, {
                shortUrl: shortUrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            fetchUrls();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Background />
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold text-white">Your Shortened URLs</h1>
                    <Link to="/home" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all cursor-pointer">
                        + Create New
                    </Link>
                </div>
                {loading && (
                    <div className="flex items-center justify-center h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                )}

                <div className="bg-opacity-5 backdrop-blur-lg rounded-xl overflow-hidden border border-white border-opacity-10">
                    {/* Table Header */}
                    <div className="grid grid-cols-10 gap-4 px-6 py-4 bg-opacity-5 border-b border-gray-200 text-gray-300 font-medium text-sm">
                        <div className="col-span-2">Name</div>
                        <div className="col-span-4">Original URL</div>
                        <div className="col-span-2">Short URL</div>
                        <div className="col-span-1 text-center">Clicks</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div>
                        {urls.map((url) => (
                            // Make it a smoky on hover
                            <div key={url._id} className="grid grid-cols-10 gap-4 px-6 py-4 border-b-1 border-gray-700 hover:bg-gray-600/30 transition-colors">
                                <div className="col-span-2 text-white truncate">
                                    {url.customShort || "Untitled"}
                                </div>
                                <div className="col-span-4 text-gray-400 truncate flex gap-2 items-center justify-start gap-3 cursor-pointer">
                                    <CopyIcon onClick={() => navigator.clipboard.writeText(url.longUrl)} className="h-4 w-4 hover:text-indigo-400 " />
                                    <a href={url.longUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 tracking-tighter text-sm hover:underline transition-colors">
                                        {url.longUrl}
                                    </a>
                                </div>
                                <div className="col-span-2 text-gray-400 truncate flex gap-2 items-center justify-start gap-2 cursor-pointer">
                                    <CopyIcon onClick={() => navigator.clipboard.writeText(`${import.meta.env.VITE_BACKEND_URL}/${url.shortUrl}`)} className="h-4 w-4 hover:text-indigo-400 " />
                                    <a href={`${import.meta.env.VITE_BACKEND_URL}/${url.shortUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline tracking-tighter hover:text-indigo-400 text-smtransition-colors">
                                        {import.meta.env.VITE_BACKEND_URL + "/" + url.shortUrl}
                                    </a>
                                </div>
                                <div className="col-span-1 text-center text-white">
                                    <div className="flex items-center justify-center space-x-1">
                                        <ChartBarIcon className="h-4 w-4 text-indigo-400" />
                                        <span>{url.clicks}</span>
                                    </div>
                                </div>
                                <div className="col-span-1 flex justify-end space-x-2">
                                    <button onClick={() => handleDelete(url.shortUrl)} className="text-gray-400 hover:text-red-400 transition-colors p-1 cursor-pointer">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {urls.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <p>You haven't created any short URLs yet.</p>
                            <button className="mt-4 text-indigo-400 hover:text-indigo-300">
                                Create your first short URL
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>

    );
}

export default Dashboard;