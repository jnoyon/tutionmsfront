"use client";
import { useState, useEffect, useRef } from "react";
import { BiPause, BiPlay } from "react-icons/bi";
import { CiGrid2H, CiGrid2V } from "react-icons/ci";

export default function HtmlEditor() {
  const [code, setCode] = useState("<h1> TopLine </h1>");
  const [autoplay, setAutoplay] = useState(true);
  const [output, setOutput] = useState(code);
  const [suggestions, setSuggestions] = useState([]);
  const [cursorPos, setCursorPos] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const textareaRef = useRef(null);

  const keywords = [
    "b", "i", "u", "h1", "h2", "del", "h3", "h4", "ul",
    "li", "h5", "h6", "sup", "sub", "src", "style"
  ];
  const autoCloseTags = keywords;

  const runPreview = () => setOutput(code);

  useEffect(() => {
    if (autoplay) setOutput(code);
  }, [code, autoplay]);

  // Handle input for code and autocomplete
  const handleInput = (e) => {
    const value = e.target.value;
    setCode(value);

    setTimeout(() => {
      const pos = textareaRef.current?.selectionStart || 0;
      setCursorPos(pos);

      const match = value.slice(0, pos).match(/<(\w*)$/);
      if (match) {
        const typed = match[1];
        const filtered = keywords.filter((k) => k.startsWith(typed));
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }, 0);
  };

  // Auto-close tag when '>' is typed
  const handleBeforeInput = (e) => {
    if (e.data === ">") {
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

  // Insert autocomplete suggestion
  const insertSuggestion = (word) => {
    const before = code.slice(0, cursorPos);
    const after = code.slice(cursorPos);
    const newCode = before.replace(/<\w*$/, "<" + word) + after;
    setCode(newCode);
    setSuggestions([]);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Insert character (like <, >, /) at cursor
  const insertAtCursor = (char) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = code.slice(0, start);
    const after = code.slice(end);
    const newCode = before + char + after;

    setCode(newCode);
    setSuggestions([]);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + char.length;
      setCursorPos(start + char.length);
    }, 0);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Toolbar */}
      <div className="flex justify-between gap-2 p-2 border-b border-gray-300 bg-base-200">
        

        {/* Custom Symbol Buttons */}
        <div className="flex gap-2 items-center">
          <button
            className="btn btn-sm text-xl"
            onClick={() => insertAtCursor("<")}
            title="Insert <"
          >
            &lt;
          </button>
          <button
            className="btn btn-sm text-xl"
            onClick={() => insertAtCursor("/")}
            title="Insert /"
          >
            /
          </button>
          <button
            className="btn btn-sm text-xl"
            onClick={() => insertAtCursor(">")}
            title="Insert >"
          >
            &gt;
          </button>
        </div>
        
        <div className="flex gap-1">
          {/* Layout Toggle */}
          <button
            onClick={() => setIsVertical(!isVertical)}
            className="btn text-xl btn-sm btn-accent"
            title="Toggle Layout"
          >
            {isVertical ? <CiGrid2H /> : <CiGrid2V />}
          </button>

          {/* Autoplay Toggle */}
          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`btn text-xl btn-sm ${autoplay ? "btn-success" : "btn-primary"}`}
            title="Autoplay"
          >
            {autoplay ? <BiPlay /> : <BiPause />}
          </button>

          {/* Manual Run Button */}
          {!autoplay && (
            <button
              onClick={runPreview}
              className="btn text-xl btn-error btn-sm"
              title="Run Code"
            >
              <BiPlay />
            </button>
          )}
        </div>

        


      </div>

      {/* Editor + Preview */}
      <div
        className={`flex flex-1 gap-1 p-1 overflow-hidden ${
          isVertical ? "flex-col" : "flex-row"
        }`}
      >
        {/* Editor */}
        <div className="flex-1 card shadow-lg bg-base-100 border border-gray-300 relative">
          <div className="card-body p-2">
            <h2 className="card-title text-sm">এইচটিএমএল কোড</h2>
            <textarea
              ref={textareaRef}
              value={code}
              onInput={handleInput}
              onBeforeInput={handleBeforeInput}
              placeholder="এখানে কোড লিখুন"
              className="textarea textarea-bordered w-full h-full font-mono text-sm bg-neutral text-green-300 resize-none"
              style={{
                minHeight: "300px",
                paddingBottom: suggestions.length > 0 ? "3rem" : undefined,
              }}
            />

            {/* Autocomplete Suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute bottom-4 left-4 bg-base-100 border rounded shadow-lg w-48 z-20 max-h-60 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => insertSuggestion(s)}
                    className="px-3 py-2 hover:bg-primary hover:text-white cursor-pointer text-base"
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
            <h2 className="card-title text-sm">আউটপুট</h2>
            <iframe
              title="preview"
              className="w-full h-full border rounded bg-white"
              style={{ minHeight: "300px" }}
              srcDoc={output}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
