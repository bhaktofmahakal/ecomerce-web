(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/WishlistClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WishlistClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function WishlistClient({ productName }) {
    _s();
    const [isWishlisted, setIsWishlisted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleWishlist = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        // In a real app, this would save to a database or local storage
        if (!isWishlisted) {
            console.log(`Added ${productName} to wishlist`);
        } else {
            console.log(`Removed ${productName} from wishlist`);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleWishlist,
        className: `p-2 rounded-full transition-all ${isWishlisted ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200 hover:text-red-500'}`,
        title: isWishlisted ? 'Remove from wishlist' : 'Add to wishlist',
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-xl",
            children: isWishlisted ? '❤️' : '🤍'
        }, void 0, false, {
            fileName: "[project]/components/WishlistClient.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/WishlistClient.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(WishlistClient, "TF3jXeIOtQI0DyVnnSYGYyEcSLs=");
_c = WishlistClient;
var _c;
__turbopack_context__.k.register(_c, "WishlistClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_WishlistClient_tsx_6457d9a4._.js.map