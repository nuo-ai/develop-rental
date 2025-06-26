[START_MEMORY_BANK]

[PROJECT_NAME]
悉尼学生房源中心 - 数据驱动应用 (Sydney Student Rental Hub - Data-Driven App)

[PROJECT_GOAL]
将已完成的高保真HTML原型，转变为一个由Google Sheets驱动的、功能性的Web应用。核心任务是实现动态数据加载和多条件筛选功能。

[TECH_STACK]

Frontend Markup: HTML

Styling: Tailwind CSS

Icons: FontAwesome

Data Source: Google Sheets (via public CSV link)

Core Logic: JavaScript (Vanilla)

Architecture: JAMstack (Client-side Rendering)

[DESIGN_SYSTEM]

视觉规范保持不变
Primary Font: Inter, system-ui, sans-serif

Color Palette:

Text (Primary): #2d2d2d

Text (Secondary): #595959

Text (Price): #000000

Accent (Primary): #007BFF

Border (Default): #E3E3E3

Background (Page): #F4F7F9

Background (Card): #FFFFFF

Key Spacing Unit: 8px

Border Radius: 8px

[FILE_SYSTEM]

文件系统已包含我们第一阶段的所有成果
[FILE: index.html]

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>悉尼学生房源中心 - 原型</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        textPrimary: '#2d2d2d',
                        textSecondary: '#595959',
                        textPrice: '#000000',
                        accentPrimary: '#007BFF',
                        borderDefault: '#E3E3E3',
                        bgPage: '#F4F7F9',
                        bgCard: '#FFFFFF',
                    }
                }
            }
        }
    </script>
    <style>
        iframe { border: none; }
    </style>
</head>
<body class="bg-bgPage flex items-center justify-center min-h-screen p-4">
    <div class="w-[393px] h-[852px] bg-black rounded-[60px] shadow-2xl p-4">
        <div class="w-full h-full bg-black rounded-[40px] overflow-hidden relative">
            <div class="w-full h-full bg-white flex flex-col">
                <div class="absolute top-0 left-0 w-full h-[44px] px-7 flex justify-between items-center z-20 text-textPrimary">
                    <span class="font-semibold text-sm">9:41</span>
                    <div class="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full"></div>
                    <div class="flex items-center space-x-1">
                        <i class="fa-solid fa-signal text-xs"></i>
                        <i class="fa-solid fa-wifi text-xs"></i>
                        <i class="fa-solid fa-battery-full text-sm"></i>
                    </div>
                </div>
                <main class="flex-1 pt-[44px] pb-[84px]">
                    <iframe id="content-frame" src="./listings.html" class="w-full h-full"></iframe>
                </main>
                <nav class="absolute bottom-0 left-0 w-full h-[84px] bg-neutral-100/80 backdrop-blur-md border-t border-borderDefault flex justify-around items-center pt-2 z-20">
                    <a href="./listings.html" target="content-frame" class="flex flex-col items-center gap-1 text-accentPrimary w-16">
                        <i class="fa-solid fa-magnifying-glass text-xl"></i>
                        <span class="text-xs font-medium">搜索</span>
                    </a>
                    <a href="./saved.html" target="content-frame" class="flex flex-col items-center gap-1 text-textSecondary hover:text-accentPrimary transition-colors">
                        <i class="fa-regular fa-heart text-xl"></i>
                        <span class="text-xs font-medium">收藏</span>
                    </a>
                    <a href="#" class="flex flex-col items-center gap-1 text-textSecondary hover:text-accentPrimary transition-colors">
                        <i class="fa-regular fa-map text-xl"></i>
                        <span class="text-xs font-medium">地图</span>
                    </a>
                </nav>
            </div>
        </div>
    </div>
</body>
</html>

[FILE: listings.html]

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        textPrimary: '#2d2d2d',
                        textSecondary: '#595959',
                        textPrice: '#000000',
                        accentPrimary: '#007BFF',
                        borderDefault: '#E3E3E3',
                        bgPage: '#F4F7F9',
                        bgCard: '#FFFFFF',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-bgPage font-sans">
    <div class="p-4">
        <header class="mb-4">
            <h1 class="text-2xl font-bold text-textPrimary">为你找到的房源</h1>
            <p class="text-textSecondary">基于你的偏好，我们推荐以下房源</p>
        </header>
        <div class="sticky top-0 bg-bgPage py-3 z-10">
            <div class="flex items-center gap-3">
                <div class="relative flex-grow">
                    <i class="fa-solid fa-magnifying-glass text-textSecondary absolute top-1/2 left-3.5 -translate-y-1/2"></i>
                    <input type="text" placeholder="搜索区域, 例如 'Zetland'" class="w-full pl-10 pr-4 py-2.5 bg-bgCard border border-borderDefault rounded-lg focus:outline-none focus:ring-2 focus:ring-accentPrimary text-sm">
                </div>
                <button class="flex-shrink-0 w-11 h-11 bg-bgCard border border-borderDefault rounded-lg flex items-center justify-center text-textPrimary">
                    <i class="fa-solid fa-sliders text-lg"></i>
                </button>
            </div>
        </div>
        <!-- 结果列表 (这是一个空的容器，等待JS填充内容) -->
        <main id="listings-container" class="space-y-4 pt-2">
            <!-- JavaScript将会在这里动态生成房源卡片 -->
        </main>
    </div>
    <!-- 关键！在这里引入我们的JavaScript文件 -->
    <script src="./main.js"></script>
</body>
</html>

[FILE: details.html]

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        textPrimary: '#2d2d2d',
                        textSecondary: '#595959',
                        textPrice: '#000000',
                        accentPrimary: '#007BFF',
                        borderDefault: '#E3E3E3',
                        bgPage: '#F4F7F9',
                        bgCard: '#FFFFFF',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-bgCard font-sans flex flex-col h-screen">
    <main class="flex-grow overflow-y-auto">
        <div class="relative">
            <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop" alt="现代化郊区住宅的客厅" class="w-full h-60 object-cover">
            <div class="absolute top-0 left-0 w-full p-4 flex justify-between items-start">
                <a href="./listings.html" class="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-textPrimary shadow-md">
                    <i class="fa-solid fa-arrow-left"></i>
                </a>
            </div>
            <div class="absolute bottom-4 left-4 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                <i class="fa-solid fa-camera"></i>
                <span>1/11</span>
            </div>
        </div>
        <div class="p-4 pb-0">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-2xl font-extrabold text-textPrice">$975<span class="text-base font-medium text-textSecondary"> / week</span></p>
                    <div class="mt-2">
                        <h1 class="text-xl font-bold text-textPrimary">402/106-116 Epsom Road,</h1>
                        <h2 class="text-lg text-textSecondary">ZETLAND NSW 2017</h2>
                    </div>
                </div>
                <div class="flex items-center gap-2 pt-1">
                     <button class="w-10 h-10 flex items-center justify-center text-textSecondary hover:text-accentPrimary transition-colors">
                        <i class="fa-solid fa-arrow-up-from-bracket text-xl"></i>
                    </button>
                    <button class="w-10 h-10 flex items-center justify-center text-textSecondary hover:text-red-500 transition-colors">
                        <i class="fa-regular fa-star text-2xl"></i>
                    </button>
                </div>
            </div>
            <div class="flex items-center text-sm text-textSecondary mt-3">
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5"><i class="fa-solid fa-bed w-4 text-center"></i><span class="font-bold text-textPrimary">1</span></div>
                    <div class="flex items-center gap-1.5"><i class="fa-solid fa-bath w-4 text-center"></i><span class="font-bold text-textPrimary">1</span></div>
                    <div class="flex items-center gap-1.5"><i class="fa-solid fa-car w-4 text-center"></i><span class="font-bold text-textPrimary">1</span></div>
                </div>
                <div class="mx-3 text-borderDefault">|</div>
                <span>Apartment / Unit / Flat</span>
            </div>
             <p class="text-sm text-textSecondary mt-2">Available from Wednesday, 2nd July 2025</p>
             <p class="text-sm text-textSecondary mt-1">Bond $3900</p>
        </div>
        <div class="p-4">
            <div class="grid grid-cols-4 gap-2 text-center text-accentPrimary">
                <a href="#" class="p-2 rounded-lg hover:bg-bgPage transition-colors">
                    <i class="fa-regular fa-envelope text-2xl"></i>
                    <span class="block text-xs mt-1 font-medium">Email</span>
                </a>
                 <a href="#" class="p-2 rounded-lg hover:bg-bgPage transition-colors">
                    <i class="fa-solid fa-phone text-2xl"></i>
                    <span class="block text-xs mt-1 font-medium">Call</span>
                </a>
                 <a href="#" class="p-2 rounded-lg hover:bg-bgPage transition-colors">
                    <i class="fa-regular fa-calendar-check text-2xl"></i>
                    <span class="block text-xs mt-1 font-medium">Inspections</span>
                </a>
                 <a href="#" class="p-2 rounded-lg hover:bg-bgPage transition-colors">
                    <i class="fa-regular fa-star text-2xl"></i>
                    <span class="block text-xs mt-1 font-medium">Shortlist</span>
                </a>
            </div>
        </div>
        <hr class="h-px bg-borderDefault mx-4">
        <div class="p-4">
            <h2 class="text-lg font-bold text-textPrimary mb-3">Property Description</h2>
            <div id="description-wrapper">
                <p id="description-text" class="text-textSecondary leading-relaxed text-sm max-h-24 overflow-hidden">
                    This brand new oversized one bedroom plus study apartment offers a sophisticated blend of modern elegance and exceptional design. Situated in the highly sought-after inner-city suburb of Zetland, this residence is perfect for students or young professionals seeking a stylish and convenient lifestyle. Features Include: <br>- One Spacious Bedroom with Built-in Wardrobe. <br>- Oversized combined living and dining with high end timber floors. <br>- Large Designer Kitchen with state of art finishes and gas cooking.
                </p>
                <button id="read-more-btn" class="text-accentPrimary font-semibold text-sm mt-2 hover:underline">Read more</button>
            </div>
        </div>
        <hr class="h-px bg-borderDefault mx-4">
        <div class="p-4">
            <h2 class="text-lg font-bold text-textPrimary mb-3">Map</h2>
            <div class="w-full h-48 bg-borderDefault rounded-lg overflow-hidden">
                 <img src="https://images.prismic.io/static-site-assets/26412a60-4963-4885-a757-12c8388c6919_map-placeholder.png?auto=compress,format" alt="显示房源位置的地图" class="w-full h-full object-cover">
            </div>
        </div>
        <hr class="h-px bg-borderDefault mx-4">
        <div class="p-4">
            <h2 class="text-lg font-bold text-textPrimary mb-3">Inspection times</h2>
            <div class="space-y-3">
                <a href="#" class="block p-3 border border-borderDefault rounded-lg hover:border-accentPrimary transition-colors">
                    <p class="font-semibold text-textPrimary">Thursday, 26 Jun</p>
                    <p class="text-textSecondary text-sm">12:30pm - 12:45pm</p>
                </a>
                <a href="#" class="block p-3 border border-borderDefault rounded-lg hover:border-accentPrimary transition-colors">
                    <p class="font-semibold text-textPrimary">Saturday, 28 Jun</p>
                    <p class="text-textSecondary text-sm">9:30am - 9:45am</p>
                </a>
            </div>
        </div>
        <div class="h-4"></div>
    </main>
    <script>
        const readMoreBtn = document.getElementById('read-more-btn');
        const descriptionText = document.getElementById('description-text');
        if (readMoreBtn && descriptionText) {
            readMoreBtn.addEventListener('click', () => {
                const isCollapsed = descriptionText.classList.contains('max-h-24');
                descriptionText.classList.toggle('max-h-24');
                readMoreBtn.textContent = isCollapsed ? 'Read less' : 'Read more';
            });
        }
    </script>
</body>
</html>

[FILE: saved.html]

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        textPrimary: '#2d2d2d',
                        textSecondary: '#595959',
                        textPrice: '#000000',
                        accentPrimary: '#007BFF',
                        borderDefault: '#E3E3E3',
                        bgPage: '#F4F7F9',
                        bgCard: '#FFFFFF',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-bgPage font-sans">
    <div class="p-4">
        <header class="mb-6">
            <h1 class="text-2xl font-bold text-textPrimary">我收藏的房源</h1>
            <p class="text-textSecondary">你可以在这里找到所有你感兴趣的房源</p>
        </header>
        <main class="space-y-4 pt-2">
            <!-- 场景二：当收藏列表为空时 -->
            <div class="text-center pt-20">
                <i class="fa-regular fa-folder-open text-6xl text-textSecondary/30"></i>
                <h2 class="mt-6 text-lg font-semibold text-textPrimary">你的收藏夹是空的</h2>
                <p class="mt-2 text-sm text-textSecondary max-w-xs mx-auto">快去列表页发现并收藏你喜欢的房源吧！</p>
                <a href="./listings.html" class="mt-6 inline-block bg-accentPrimary text-white font-bold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity">
                    去发现
                </a>
            </div>
        </main>
    </div>
</body>
</html>

[FILE: main.js]

// This file will contain the logic to fetch data and render listings.
// We will populate this in the next step.

[PROGRESS]

阶段一: UI原型设计 (Phase 1: UI Prototyping)

[x] 1.1: 创建 index.html 手机模拟器外壳。

[x] 1.2: 创建 listings.html 列表页高保真原型。

[x] 1.3: 创建 details.html 详情页高保真原型。

[x] 1.4: 创建 saved.html 收藏页高保真原型。

阶段二: 数据驱动与功能实现 (Phase 2: Data & Functionality)

[ ] 2.1: 实现从Google Sheets动态加载数据并渲染到listings.html。

[ ] 2.2: 实现多条件筛选功能。

[ ] 2.3: 实现详情页的数据动态展示。

[ ] 2.4: 实现收藏功能。

[CURRENT_CONTEXT]
我们已经完成了项目的第一阶段（高保真UI原型）。现在正式进入第二阶段。您刚刚确认了我们的文件结构和id设置，但遇到了数据未能显示的问题。通过您的浏览器控制台截图，我们发现了一个关键的CORS策略错误。这是因为出于安全原因，浏览器禁止一个源（您的本地file://协议）直接请求另一个源（docs.google.com）的数据。

[INSTRUCTION]
目标： 解决CORS错误，并成功将Google Sheets的数据动态加载到listings.html页面。

解释与解决方案：
您遇到的 Access-Control-Allow-Origin 错误是Web开发中非常常见且重要的安全机制。为了绕过它进行开发，我们需要一个“代理”服务器。我将在main.js的代码中为您集成一个公开免费的CORS代理服务。

操作步骤：

创建JS文件: 请在您的项目根目录下创建一个名为 main.js 的文件。

粘贴代码: 将下面的JavaScript代码完整地粘贴到您刚刚创建的 main.js 文件中。

确认HTML链接: 确保您的 listings.html 文件底部包含 <script src="./main.js"></script> 这一行。

刷新预览: 保存所有文件后，请刷新您在浏览器中打开的 index.html。

请将以下代码粘贴到 main.js 文件中:

// --- Sydney Student Rental Hub - Main JavaScript ---

document.addEventListener('DOMContentLoaded', () => {

    const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRjskDDCdppre4o6pF95kjBwxIfoXzO19E4ycb-6Ggn0JBnDVjNFvAR7Qhshd11TBlTa37VqvTsS9A6/pub?output=csv';
    const listingsContainer = document.querySelector('#listings-container');

    function parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].trim().split(',');
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue;
            const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
            const entry = {};
            for (let j = 0; j < headers.length; j++) {
                if(headers[j]){
                   entry[headers[j].trim().replace(/"/g, '')] = values[j] ? values[j].replace(/^"|"$/g, '').trim() : '';
                }
            }
            data.push(entry);
        }
        return data;
    }

    function createListingCard(property) {
        const streetAddress = property.address || '地址未知';
        const suburbAndPostcode = `${property.suburb || ''} ${property.state || ''} ${property.postcode || ''}`.trim();
        const bedrooms = property.bedrooms || 0;
        const bathrooms = property.bathrooms || 0;
        const parking = property.parking_spaces || 0;
        const coverImage = property.cover_image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop';
        const propertyType = property.property_type || 'Apartment';
        const availableDate = property.available_date || '待定';

        return `
            <a href="./details.html" class="block bg-bgCard rounded-lg shadow-sm overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                <div class="relative">
                    <img src="${coverImage}" alt="房源图片: ${streetAddress}" class="w-full h-52 object-cover">
                    <div class="absolute top-3 right-3 flex gap-2">
                        <button class="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-textPrimary hover:text-red-500 transition-colors">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-center">
                        <p class="text-2xl font-extrabold text-textPrice">$${property.rent_pw}<span class="text-base font-medium text-textSecondary"> / week</span></p>
                        <button class="text-textSecondary hover:text-accentPrimary"><i class="fa-regular fa-star text-2xl"></i></button>
                    </div>
                    <div class="mt-2">
                        <p class="text-lg font-semibold text-textPrimary truncate">${streetAddress},</p>
                        <p class="text-base text-textSecondary">${suburbAndPostcode}</p>
                    </div>
                    <div class="flex items-center gap-4 mt-3 text-textSecondary border-t border-borderDefault pt-3">
                        <div class="flex items-center gap-2"><i class="fa-solid fa-bed text-lg w-5 text-center"></i><span class="font-bold text-textPrimary">${bedrooms}</span></div>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-bath text-lg w-5 text-center"></i><span class="font-bold text-textPrimary">${bathrooms}</span></div>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-car text-lg w-5 text-center"></i><span class="font-bold text-textPrimary">${parking}</span></div>
                        <span class="text-sm text-textSecondary pl-2 border-l border-borderDefault">${propertyType}</span>
                    </div>
                     <div class="flex items-center gap-2 mt-3 text-textSecondary text-sm">
                        <i class="fa-regular fa-calendar-check w-5 text-center"></i>
                        <span>Available from ${availableDate}</span>
                    </div>
                </div>
            </a>
        `;
    }

    async function initializeListings() {
        if (!listingsContainer) {
            return;
        }
        listingsContainer.innerHTML = '<p class="text-center text-textSecondary py-10">正在从Google Sheets加载房源...</p>';
        try {
            // 使用一个公开的CORS代理来解决本地开发时的跨域问题
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(proxyUrl + encodeURIComponent(SPREADSHEET_URL));
            
            if (!response.ok) {
                throw new Error(`网络请求失败: ${response.status} ${response.statusText}`);
            }
            
            const csvText = await response.text();
            const properties = parseCSV(csvText);
            
            listingsContainer.innerHTML = '';

            if (properties.length === 0) {
                listingsContainer.innerHTML = '<p class="text-center text-textSecondary py-10">没有找到任何房源。</p>';
                return;
            }
            
            properties.forEach(property => {
                const cardHTML = createListingCard(property);
                listingsContainer.insertAdjacentHTML('beforeend', cardHTML);
            });

        } catch (error) {
            console.error('获取或处理房源数据时出错:', error);
            listingsContainer.innerHTML = `<p class="text-center text-red-500 py-10">无法加载房源数据。错误: ${error.message}。</p>`;
        }
    }

    initializeListings();
});

[END_MEMORY_BANK]