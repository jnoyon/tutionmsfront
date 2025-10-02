"use client";
import { useState, useEffect, useRef } from "react";

export default function HtmlEditor() {
  const [code, setCode] = useState("<h1> TopLine </h1>");
  const [autoplay, setAutoplay] = useState(true);
  const [output, setOutput] = useState(code);
  const [suggestions, setSuggestions] = useState([]);
  const [cursorPos, setCursorPos] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const textareaRef = useRef(null);

  const keywords = [
    "b", "i", "u", "h1", "h2", "del", "h3", "h4", "ul", "li", "h5", "h6", "sup", "sub", "src", "style",
  ];

  const autoCloseTags = [
    "b", "i", "u", "h1", "h2", "del", "h3", "h4", "ul", "li", "h5", "h6", "sup", "sub", "src", "style",
  ];

  const runPreview = () => setOutput(code);

  useEffect(() => {
    if (autoplay) setOutput(code);
  }, [code, autoplay]);

  const handleChange = (e) => {
    setCode(e.target.value);
    setCursorPos(e.target.selectionStart);

    const match = e.target.value.slice(0, e.target.selectionStart).match(/<(\w*)$/);
    if (match) {
      const typed = match[1];
      const filtered = keywords.filter((k) => k.startsWith(typed));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ">") {
      const pos = textareaRef.current.selectionStart;
      const value = code;

      const beforeCursor = value.slice(0, pos);
      const tagMatch = beforeCursor.match(/<(\w+)$/);

      if (tagMatch) {
        const tag = tagMatch[1];
        if (autoCloseTags.includes(tag)) {
          e.preventDefault();

          const afterCursor = value.slice(pos);
          const insert = `>${`</${tag}>`}`;
          const newCode = beforeCursor + insert + afterCursor;
          setCode(newCode);

          setTimeout(() => {
            textareaRef.current.selectionStart = pos + 1;
            textareaRef.current.selectionEnd = pos + 1;
          }, 0);
        }
      }
    }
  };

  const insertSuggestion = (word) => {
    const before = code.slice(0, cursorPos);
    const after = code.slice(cursorPos);
    const newCode = before.replace(/<\w*$/, "<" + word) + after;
    setCode(newCode);
    setSuggestions([]);
    textareaRef.current.focus();
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-100px)] bg-base-200">
      {/* Layout Toggle */}
      <div className="flex justify-end p-1 border-b bg-base-100">
        <button
          onClick={() => setIsVertical(!isVertical)}
          className="btn btn-sm btn-outline"
        >
          {isVertical ? "Horizontal Layout" : "Vertical Layout"}
        </button>
      </div>

      {/* Editor + Preview */}
      <div
        className={`flex flex-1 gap-2 p-2 ${isVertical ? "flex-col" : "flex-row"}`}
      >
        {/* Editor */}
        <div className="flex-1 card shadow-lg bg-base-100 border border-gray-300 relative">
          <div className="card-body p-2">
            <h2 className="card-title text-sm mb-2">এইচটিএমএল কোড</h2>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="এখানে কোড লিখুন"
              className="textarea textarea-bordered w-full h-full font-mono text-sm bg-neutral text-green-300 resize-none"
              style={{ minHeight: "400px" }}
            />
            {/* Autocomplete */}
            {suggestions.length > 0 && (
              <ul className="absolute bg-base-100 border rounded shadow-lg w-40 z-10 mt-1">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => insertSuggestion(s)}
                    className="px-2 py-1 hover:bg-primary hover:text-white cursor-pointer text-sm"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 card shadow-lg bg-base-100 border border-gray-300">
          <div className="card-body p-2">
            <h2 className="card-title text-sm mb-2">আউটপুট</h2>
            <iframe
              title="preview"
              className="w-full h-full border rounded bg-white"
              style={{ minHeight: "400px" }}
              srcDoc={output}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center px-4 py-3 bg-base-100 border-t shadow-inner">
        <button
          onClick={() => setAutoplay(!autoplay)}
          className={`btn btn-sm ${autoplay ? "btn-success" : "btn-outline"}`}
        >
          {autoplay ? "অটোপ্লে: চালু" : "অটোপ্লে: বন্ধ"}
        </button>
        {!autoplay && (
          <button onClick={runPreview} className="btn btn-primary btn-sm">
            ▶ রান করুন
          </button>
        )}
      </div>
    </div>
  );
}
