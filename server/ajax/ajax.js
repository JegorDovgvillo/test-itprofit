
export const useAjax = () => {
  const request = ({
    url,
    method = "POST",
    data = null,
    contentType = "application/json",
  }) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", contentType);

      xhr.onload = () => {
        const response = {
          status: xhr.status,
          data: null,
        };

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            response.data = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            response.data = "Invalid JSON response";
            reject(response);
          }
        } else {
          response.data = JSON.parse(xhr.responseText);
          resolve(response);
        }
      };

      xhr.onerror = () => {
        reject("Network error");
      };

      if (data) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    });
  };

  return {
    request,
  };
};
