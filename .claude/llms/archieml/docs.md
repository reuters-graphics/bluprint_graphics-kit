---
name: ArchieML
description: Writing ArchieML syntax in rngs.io to match content block types used in graphics components
---

# ArchieML

ArchieML is a lightweight and intuitive markup language that allows for easily structuring data within text documents. It is designed to be human-readable, very flexible, and is particularly useful for creating structured data by users who may never have seen ArchieML or any other markup language before.

## Basic Syntax

- **Keys and Values**

  - Definition: Key-value pairs are defined by a line starting with a key followed by a colon. Keys can include any unicode character except whitespace and specific characters used within ArchieML ({ } [ ] : . +).

  - Example:

    ```
    key: This is a value
    ☃: Unicode Snowman for you and you and you!
    ```

  - Parsed JSON:

    ```json
    {
      "key": "This is a value",
      "☃": "Unicode Snowman for you and you and you!"
    }
    ```

  - Whitespace around keys and values is ignored. Keys are case-sensitive.

- **Multi-line Values**: Multi-line values are anchored with `:end`. All whitespace is preserved.

  - Example:

    ```
    key: value
    More value

    Even more value
    :end
    ```

  - Parsed JSON:
    ```json
    {
      "key": "value\n More value\n\nEven more value"
    }
    ```
  - Escape Characters: Lines that would be interpreted as keys or commands can be escaped with a backslash `\`.
    - Example:
      ```
      key: value
      \:end
      :end
      ```
    - Parsed JSON:
      ```json
      {
        "key": "value\n:end"
      }
      ```

- **Nested Structures**

  - **Dot-Notation**: Use dot-notation for creating nested objects.
    - Example:
      ```
      colors.red: #f00
      colors.green: #0f0
      colors.blue: #00f
      ```
    - Parsed JSON:
      ```json
      {
        "colors": {
          "red": "#f00",
          "green": "#0f0",
          "blue": "#00f"
        }
      }
      ```
  - **Object Blocks**: Group keys using object blocks defined by {}. Close an object with {} or by starting a new object.

    - Example:

      ```
      {colors}
      red: #f00
      green: #0f0
      blue: #00f
      {}

      {numbers}
      one: 1
      ten: 10
      one-hundred: 100
      {}
      ```

    - Parsed JSON:
      ```json
      {
        "colors": {
          "red": "#f00",
          "green": "#0f0",
          "blue": "#00f"
        },
        "numbers": {
          "one": "1",
          "ten": "10",
          "one-hundred": "100"
        }
      }
      ```

- **Arrays**

  - **Arrays of Objects**: Define arrays with brackets [arrayName]. New objects start when the first key is re-encountered.

    - Example:

      ```
      [arrayName]
      name: Amanda
      age: 26

      name: Tessa
      age: 30
      []
      ```

    - Parsed JSON:
      ```json
      {
        "arrayName": [
          {
            "name": "Amanda",
            "age": "26"
          },
          {
            "name": "Tessa",
            "age": "30"
          }
        ]
      }
      ```

  - **Arrays of Strings**: Simple arrays use _ for elements. If _ is first, the array ignores key-value pairs.
    - Example:
      ```
      [days]
      * Sunday
      * Monday
      * Tuesday
      * Wednesday
      * Thursday
      * Friday
      * Saturday
      []
      ```
    - Parsed JSON:
      ```json
      {
        "days": [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ]
      }
      ```
  - **Nested Arrays**: Nested arrays use dot notation and are closed with `[]`.

    - Example:

      ```
      [days]
      name: Monday
      [.tasks]
      * Clean dishes
      * Pick up room
      []

      name: Tuesday
      [.tasks]
      * Buy milk
      []
      ```

    - Parsed JSON:
      ```json
      {
        "days": [
          {
            "name": "Monday",
            "tasks": ["Clean dishes", "Pick up room"]
          },
          {
            "name": "Tuesday",
            "tasks": ["Buy milk"]
          }
        ]
      }
      ```
