exports.uploadAudioFile = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message:
        "Upload file không thành công, vui lòng kiểm tra lại định dạng hoặc kích thước file.",
    });
  }

  const fileName = req.file.filename;
  const filePath = `/audio/${fileName}`;

  res.status(201).json({
    message: "Upload file thành công!",
    filePath: filePath,
  });
};
