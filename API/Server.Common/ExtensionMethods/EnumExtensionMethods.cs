using System;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

namespace Server.Common.ExtensionMethods
{
    public static class EnumExtensionMethods
    {
        public static string GetDescription(this Enum item)
        {
            var type = item.GetType();
            MemberInfo[] memberInfo = type.GetMember(item.ToString());

            var res = memberInfo
                ?.FirstOrDefault()
                ?.GetCustomAttribute<DescriptionAttribute>(false)
                ?.Description;

            return res;
        }
    }
}
