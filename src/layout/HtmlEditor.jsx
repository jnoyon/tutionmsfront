"use client";
import { useState, useEffect, useRef } from "react";
import { BiPause, BiPlay } from "react-icons/bi";
import { CgCode } from "react-icons/cg";
import { CiEraser, CiGrid2H, CiGrid2V, CiMonitor } from "react-icons/ci";

export default function HtmlEditor() {
  const [code, setCode] = useState("");
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

  // 🔹 HTML Snippets to insert
  const htmlSnippets = {
    orderedList: `<ol>
  <li>Bangla</li>
  <li>English</li>
  <li>ICT</li>
</ol>`,
    unorderedList: `<ul>
  <li>Bangla</li>
  <li>English</li>
  <li>ICT</li>
</ul>`,
    table: `<table border="1">
  <tr>
    <th>Roll</th>
    <th>Name</th>
  </tr>
  <tr>
    <td>01</td>
    <td>Arif</td>
  </tr>
  <tr>
    <td>02</td>
    <td>Rabbi</td>
  </tr>
</table>`,
    headings: `<h1>Heading One</h1>
<h2>Heading Two</h2>
<h3>Heading Three</h3>`,
    redText: `<p style="color: red">টপলাইন একাডেমি</p>`,
  };

  const insertSnippet = (snippet) => {
    setCode(snippet);
    setSuggestions([]);
    if (autoplay) {
      setOutput(snippet);
    }
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const runPreview = () => setOutput(code);

  useEffect(() => {
    if (autoplay) setOutput(code);
  }, [code, autoplay]);

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
    <div className="flex flex-col min-h-screen">
      {/* Toolbar */}
      <div className="flex justify-between gap-2 p-2 border-b border-gray-300 bg-base-200">
        {/* Symbol Buttons */}
        <div className="flex gap-2 items-center">
          <button className="btn btn-sm text-xl" onClick={() => insertAtCursor("<")}>
            &lt;
          </button>
          <button className="btn btn-sm text-xl" onClick={() => insertAtCursor("/")}>
            /
          </button>
          <button className="btn btn-sm text-xl" onClick={() => insertAtCursor(">")}>
            &gt;
          </button>
          <button
          className="btn text-white btn-error btn-sm"
          onClick={() => {
            setCode("");
            setSuggestions([]);
            if (autoplay) {
              setOutput("");
            }
          }}
        >
          <CiEraser className="text-xl"></CiEraser> মুছুন
        </button>
        </div>

        {/* Layout and Playback Controls */}
        <div className="flex gap-1">
          <button onClick={() => setIsVertical(!isVertical)} className="btn text-xl btn-sm btn-accent">
            {isVertical ? <CiGrid2H /> : <CiGrid2V />}
          </button>
          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`btn text-xl btn-sm ${autoplay ? "btn-success" : "btn-primary"}`}
          >
            {autoplay ? <BiPlay /> : <BiPause />}
          </button>
          {!autoplay && (
            <button onClick={runPreview} className="btn text-xl btn-error btn-sm">
              <BiPlay />
            </button>
          )}

          
        </div>
      </div>

      {/* Editor + Preview */}
      <div
        className={`flex flex-1 gap-0.5 p-1 overflow-hidden ${
          isVertical ? "flex-col" : "flex-row"
        }`}
      >
        {/* Editor */}
        <div className="flex-1 card shadow-lg bg-base-100 border border-gray-300 relative">
          <div className="card-body p-1">
            <h2 className="card-title text-sm px-2 mt-1">
              <CgCode /> এইচটিএমএল কোড
            </h2>
            <textarea
              ref={textareaRef}
              value={code}
              onInput={handleInput}
              onBeforeInput={handleBeforeInput}
              placeholder="এখানে কোড লিখুন"
              className="textarea textarea-bordered w-full h-full font-mono text-sm bg-neutral text-green-300 resize-none"
              style={{
                minHeight: "200px",
                paddingBottom: suggestions.length > 0 ? "3rem" : undefined,
              }}
            />
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
          <div className="card-body p-1">
            <h2 className="card-title text-sm px-2 mt-1">
              <CiMonitor /> আউটপুট
            </h2>
            <iframe
              title="preview"
              className="w-full h-full border border-gray-300 rounded bg-white"
              style={{ minHeight: "200px" }}
              srcDoc={output}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>

      {/* Snippets Section */}
      <div className="border border-gray-300 p-3 bg-base-100">
        <h1 className="text-center font-bold bg-primary py-2 text-white mb-3">
          এইচটিএমএল স্যাম্পল কোড
        </h1>
        <div className="flex flex-wrap justify-center gap-2">
          <button className="btn btn-warning btn-sm" onClick={() => insertSnippet(htmlSnippets.orderedList)}>
            অর্ডার লিস্ট
          </button>
          <button className="btn btn-warning btn-sm" onClick={() => insertSnippet(htmlSnippets.unorderedList)}>
            আনঅর্ডার লিস্ট
          </button>
          <button className="btn btn-warning btn-sm" onClick={() => insertSnippet(htmlSnippets.table)}>
            টেবিল
          </button>
          <button className="btn btn-warning btn-sm" onClick={() => insertSnippet(htmlSnippets.headings)}>
            হেডিং ট্যাগ
          </button>
          <button className="btn btn-warning btn-sm" onClick={() => insertSnippet(htmlSnippets.redText)}>
            রেড টেক্সট
          </button>
        </div>
      </div>
    </div>
  );
}
