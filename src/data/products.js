export const syncMetadata = {
    lastSync: "2026-04-27T17:00:00Z",
    status: "success",
    itemsTracked: 17
};

export const products = [
    // --- CORE COMPONENTS ---
    {
        id: "CPU-9800X3D",
        name: "AMD Ryzen 7 9800X3D",
        category: "CPU",
        url: "https://www.newegg.ca/amd-ryzen-7-9000-series-ryzen-7-9800x3d-granite-ridge-zen-5-socket-am5-desktop-cpu-processor/p/N82E16819113877",
        wattage: 120,
        price: 629.99, 
        brand: "AMD",
        specs: ["Zen 5 8-Core", "96MB L3 V-Cache", "5.2 GHz Boost"]
    },
    {
        id: "GPU-9070XT-ICE",
        name: "GIGABYTE Radeon RX 9070 XT",
        category: "GPU",
        url: "https://www.newegg.ca/gigabyte-gv-r9070xtgaming-oc-16gd-radeon-rx-9070-xt-16gb-graphics-card-triple-fans/p/N82E16814932751",
        wattage: 304,
        price: 1029.99,
        brand: "GIGABYTE",
        specs: ["16GB GDDR6", "PCIe 5.0", "White Gaming OC ICE"]
    },
    {
        id: "MOBO-X870-ICE",
        name: "GIGABYTE X870 AORUS ELITE ICE",
        category: "MOBO",
        url: "https://www.newegg.ca/p/N82E16813145517",
        wattage: 60,
        price: 319.99,
        brand: "GIGABYTE",
        specs: ["AM5 LGA 1718", "Wi-Fi 7 / USB4", "White PCB"]
    },
    {
        id: "RAM-TCREATE-32",
        name: "Team Group T-CREATE Expert",
        category: "RAM",
        url: "https://www.newegg.ca/team-32gb-ddr5-6000/p/N82E16820331995",
        wattage: 7,
        price: 139.99,
        brand: "Team Group",
        specs: ["32GB (2x16GB)", "DDR5 6000MHz", "White Heatspreader"]
    },

    // --- POWER & COOLING ---
    {
        id: "PSU-EDGE-1000",
        name: "Lian Li Edge 1000W White",
        category: "POWER",
        url: "https://www.newegg.ca/lian-li-edge-series-atx-80-plus-platinum-certified-power-supplies-eg1000-white/p/1HU-01PP-00009",
        wattage: 0, 
        capacity: 1000, 
        price: 274.99,
        brand: "Lian Li",
        specs: ["ATX 3.1 / Gold", "L-Shape Design", "USB Hub Included"]
    },
    {
        id: "AIO-HYDRO-II",
        name: "Lian Li Hydroshift II-S 360",
        category: "COOLING",
        url: "https://www.newegg.ca/lian-li-liquid-cooling-system-hydroshift-ii-lcd-s-white/p/2YM-002Y-00054",
        wattage: 25,
        price: 239.99,
        brand: "Lian Li",
        specs: ["3.4\" IPS LCD Square Screen", "Daisy-Chain", "White"]
    },

    // --- CASE & FANS ---
    {
        id: "CASE-Y70-W",
        name: "HYTE Y70 Touch Infinite",
        category: "CASE",
        url: "https://www.newegg.ca/p/N82E16811737035",
        wattage: 15,
        price: 439.99,
        brand: "HYTE",
        specs: ["2.5K LCD Touchscreen", "Snow White", "Panoramic Glass"]
    },
    {
        id: "FAN-SL-LCD-3P",
        name: "UNI Fan SL LCD Wireless (Reverse)",
        category: "FANS",
        url: "https://www.newegg.ca/p/1YF-005G-000R1",
        wattage: 9,
        price: 159.99,
        brand: "Lian Li",
        specs: ["1.6\" LCD Display", "Reverse Blade", "Triple Pack"]
    },
    {
        id: "FAN-SL-WL-3P",
        name: "UNI Fan SL Wireless (3-Pack)",
        category: "FANS",
        url: "https://www.newegg.ca/p/1YF-005G-000R2",
        wattage: 6,
        price: 124.99,
        brand: "Lian Li",
        specs: ["2.4 GHz Wireless", "Triple Pack", "White"]
    },
    {
        id: "FAN-SL-WL-1P",
        name: "UNI Fan SL Wireless (Single)",
        category: "FANS",
        url: "https://www.newegg.ca/p/1YF-005G-000R5",
        wattage: 2, 
        price: 39.99,
        brand: "Lian Li",
        specs: ["Daisy-Chain Design", "Single Pack", "White"]
    },
    {
        id: "FAN-CL120-3P",
        name: "UNI Fan CL120 ARGB (3-Pack)",
        category: "FANS",
        url: "https://www.newegg.ca/lian-li-12cl1w3w-case-fan-120-mm-argb-led/p/1YF-005G-000R3",
        wattage: 5, 
        price: 80.06,
        brand: "Lian Li",
        specs: ["Dual Light Zones", "FDB Bearing", "White"]
    },

    // --- STORAGE ---
    {
        id: "SSD-T705-1TB",
        name: "Crucial T705 1TB Gen5",
        category: "STORAGE",
        url: "https://www.newegg.ca/crucial-1tb-t705-nvme/p/N82E16820156397",
        wattage: 12,
        price: 299.99,
        brand: "Crucial",
        specs: ["13,600 MB/s", "PCIe Gen5 NVMe"]
    },
    {
        id: "SSD-SN7100-1TB",
        name: "WD_BLACK SN7100 1TB",
        category: "STORAGE",
        url: "https://www.newegg.ca/western-digital-1tb-sn7100-nvme/p/N82E16820250275",
        wattage: 5,
        price: 149.99,
        brand: "Western Digital",
        specs: ["PCIe Gen 4.0 x4", "M.2 2280"]
    },

    // --- PERIPHERALS ---
    {
        id: "MONITOR-MSI-4K",
        name: "MSI MAG 274URFW 27” 4K",
        category: "PERIPHERALS",
        url: "https://www.newegg.ca/p/N82E16824475373",
        wattage: 26,
        price: 649.99,
        brand: "MSI",
        specs: ["160Hz / 0.5ms GTG", "4K Rapid IPS", "White"]
    },
    {
        id: "KBD-RT80-W",
        name: "YUNZII RT80 Magnetic",
        category: "PERIPHERALS",
        url: "https://www.newegg.ca/p/32N-010B-00007",
        wattage: 2, 
        price: 179.99,
        brand: "YUNZII",
        specs: ["Hall Effect", "8K Polling", "White Gateron"]
    },
    {
        id: "MOUSE-X11-W",
        name: "Attack Shark X11 Superlight",
        category: "PERIPHERALS",
        url: "https://www.newegg.ca/p/32N-04VE-00001",
        wattage: 1, 
        price: 79.99,
        brand: "MAGIC-REFINER",
        specs: ["59g Superlight", "22,000 DPI", "White"]
    },
    {
        id: "MOUNT-HYDRA-W",
        name: "Amer Mounts Dual Hydra Arm",
        category: "PERIPHERALS",
        url: "https://www.newegg.ca/p/0VE-0130-00003",
        wattage: 0, 
        price: 154.99,
        brand: "Amer Mounts",
        specs: ["Heavy Duty Spring", "12kg Max", "White"]
    }
];